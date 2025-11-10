import time
import hashlib
import json
import uuid
from urllib.parse import urlparse

import requests
import random
from flask import Flask, jsonify, request, render_template_string
from flask_cors import CORS


# --- Part 1: Blockchain Logic (from blockchain.py) ---

class Blockchain:
    """
    Manages the blockchain, including creating blocks and handling transactions (emergencies).
    """

    def __init__(self):
        """
        Initializes the blockchain with a genesis block.
        """
        self.chain = []
        self.current_emergencies = []
        self.nodes = set()
        # Create the genesis block
        self.new_block(previous_hash='1', proof=100)

    def register_node(self, address):
        """
        Add a new node to the list of nodes.
        :param address: <str> Address of node. Eg. 'http://192.168.0.5:5000'
        """
        if not address:
            raise ValueError('Invalid node address')

        parsed_url = urlparse(address)
        if parsed_url.netloc:
            node_address = f"{parsed_url.scheme or 'http'}://{parsed_url.netloc}"
        elif parsed_url.path:
            node_address = f"http://{parsed_url.path}"
        else:
            raise ValueError('Invalid node address')

        self.nodes.add(node_address.rstrip('/'))

    def valid_chain(self, chain):
        """
        Determine if a given blockchain is valid.
        :param chain: <list> A blockchain to validate
        :return: <bool> True if valid, False if not
        """
        if not chain:
            return False

        def _hash_without_embedded_hash(block_data):
            block_copy = dict(block_data)
            block_hash = block_copy.pop('hash', None)
            return block_hash, self.hash(block_copy)

        stored_hash, calculated_hash = _hash_without_embedded_hash(chain[0])
        if stored_hash and stored_hash != calculated_hash:
            return False

        for current_index in range(1, len(chain)):
            previous_block = chain[current_index - 1]
            current_block = chain[current_index]

            prev_stored_hash, prev_calculated_hash = _hash_without_embedded_hash(previous_block)
            if prev_stored_hash and prev_stored_hash != prev_calculated_hash:
                return False

            current_stored_hash, current_calculated_hash = _hash_without_embedded_hash(current_block)
            if current_stored_hash and current_stored_hash != current_calculated_hash:
                return False

            if current_block.get('previous_hash') != (prev_stored_hash or prev_calculated_hash):
                return False

            previous_proof = previous_block.get('proof')
            current_proof = current_block.get('proof')
            if previous_proof is None or current_proof is None:
                return False

            if not self.valid_proof(previous_proof, current_proof):
                return False

        return True

    def resolve_conflicts(self):
        """
        Consensus Algorithm: Resolve conflicts by replacing our chain with the longest valid one in the network.
        :return: <bool> True if our chain was replaced, False if not
        """
        neighbours = self.nodes
        new_chain = None

        max_length = len(self.chain)

        for node in neighbours:
            try:
                response = requests.get(f'{node}/chain', timeout=5)
                if response.status_code != 200:
                    continue
                data = response.json()
            except (requests.exceptions.RequestException, ValueError):
                continue

            length = data.get('length')
            chain = data.get('chain')

            if isinstance(length, int) and isinstance(chain, list):
                if length > max_length and self.valid_chain(chain):
                    max_length = length
                    new_chain = chain

        if new_chain:
            self.chain = new_chain
            self.current_emergencies = []
            return True

        return False

    def new_block(self, proof, previous_hash):
        """
        Creates a new block and adds it to the chain.
        :param proof: <int> The proof given by the Proof of Work algorithm
        :param previous_hash: <str> Hash of the previous block
        :return: <dict> New Block
        """
        block = {
            'index': len(self.chain) + 1,
            'timestamp': time.time(),
            'emergencies': [dict(emergency) for emergency in self.current_emergencies],
            'proof': proof,
            'previous_hash': previous_hash or self.hash(self.chain[-1]),
        }
        # Calculate the hash of this new block
        block['hash'] = self.hash(block)

        # Reset the current list of emergencies
        self.current_emergencies = []

        # Add the block to the chain
        self.chain.append(block)
        return block

    def new_emergency(self, sender, details, location, resources):
        """
        Adds a new emergency report to the list of current emergencies
        to be included in the next mined block.

        :param sender: <str> Address of the sender
        :param details: <str> Details of the emergency
        :param location: <list> [latitude, longitude]
        :param resources: <list> List of required resources
        :return: <int> The index of the block that will hold this emergency
        """
        self.current_emergencies.append({
            'sender': sender,
            'details': details,
            'location': location,
            'resources': resources,
            'timestamp': time.time()
        })
        # Return the index of the next block to be mined
        return self.last_block['index'] + 1

    @staticmethod
    def hash(block):
        """
        Creates a SHA-256 hash of a Block.
        :param block: <dict> Block
        :return: <str>
        """
        # We must make sure that the Dictionary is Ordered, or we'll have inconsistent hashes
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    @property
    def last_block(self):
        """
        Returns the last block in the chain.
        """
        return self.chain[-1]

    def proof_of_work(self, last_proof):
        """
        Simple Proof of Work Algorithm:
         - Find a number 'p' such that hash(pp') contains 4 leading zeroes, where p is the previous proof, and p' is the new proof.
        :param last_proof: <int>
        :return: <int>
        """
        proof = 0
        while self.valid_proof(last_proof, proof) is False:
            proof += 1
        return proof

    @staticmethod
    def valid_proof(last_proof, proof):
        """
        Validates the Proof: Does hash(last_proof, proof) contain 4 leading zeroes?
        :param last_proof: <int> Previous Proof
        :param proof: <int> Current Proof
        :return: <bool> True if correct, False if not.
        """
        guess = f'{last_proof}{proof}'.encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        # Check for 4 leading zeroes
        return guess_hash[:4] == "0000"


# --- Part 2: Authentication Logic (from auth_logic.py) ---

# --- User Database ---
db = {
    "citizens": [],
    "taskforce": {
        "paramedics": [],
        "police": [],
        "firefighters": []
    },
    "volunteers": [],
    "admins": [
        {
            "id": "seed-admin-001",
            "username": "ayaanm786",
            "password": "786007",
            "fullName": "Mohammed Ayaan Asfaq Malek",
            "profession": "Admin"
        }
    ],
}


# --- Database Helper Functions ---
def _add_record(user_list, data):
    """
    Internal function to add a new user to a specific list.
    """
    if 'username' not in data or 'password' not in data:
        print("Error: Username and password required.")
        return None, "Username and password required."
    if find_user_by_username(data['username'])[0]:
        msg = f"Error: Username '{data['username']}' already exists."
        print(msg)
        return None, msg
    data['id'] = str(uuid.uuid4())
    # --- SECURITY NOTE: HASH PASSWORD ---
    # In a real app, hash the password. For this example, we store it plain.
    # data['password'] = hashlib.sha256(data['password'].encode()).hexdigest()
    user_list.append(data)
    print(f"Added: {data['username']} (ID: {data['id']})")
    return data, None


# --- Public Auth/DB Functions ---
def find_user_by_username(username):
    """
    Finds a user and their category/list by their username.
    """
    for category, users in db.items():
        if isinstance(users, list):
            for user in users:
                if user.get('username') == username:
                    return user, category, users
        elif isinstance(users, dict):
            for sub_category, sub_list in users.items():
                for user in sub_list:
                    if user.get('username') == username:
                        return user, f"taskforce.{sub_category}", sub_list
    return None, None, None


def delete_user_by_id(category, sub_category, record_id):
    """
    Deletes a user record by their unique ID.
    """
    target_list = None
    if category == "taskforce" and sub_category in db["taskforce"]:
        target_list = db["taskforce"][sub_category]
    elif category in db and isinstance(db[category], list):
        target_list = db[category]

    if target_list:
        for i, record in enumerate(target_list):
            if record.get('id') == record_id:
                del target_list[i]
                print(f"Deleted record ID '{record_id}'")
                return True, None
    return False, f"Error: Record ID '{record_id}' not found."


def update_user_record(username, data_to_update):
    """
    Finds a user by their original username and updates their record.
    """
    user, category_path, user_list = find_user_by_username(username)
    if not user:
        return None, f"User '{username}' not found"
    if 'id' in data_to_update:
        del data_to_update['id']
    new_username = data_to_update.get('username', username)
    if new_username != username:
        existing_user, _, _ = find_user_by_username(new_username)
        if existing_user:
            return None, f"New username '{new_username}' already exists."
    is_taskforce = category_path and category_path.startswith('taskforce.')
    core_fields = {'username', 'password', 'fullName', 'profession'}
    for field in core_fields:
        if field in data_to_update:
            if field == 'password' and not data_to_update[field]: continue
            user[field] = data_to_update[field]

    # Use 'details' object ONLY for taskforce
    if is_taskforce:
        details_target = user.setdefault('details', {})
    else:
        # For citizens/volunteers, add directly to the user object
        details_target = user

    for field, value in data_to_update.items():
        if field not in core_fields:
            details_target[field] = value

    return user, None


# --- Specific Add Functions (called by registration routes) ---
def add_paramedic(data): return _add_record(db["taskforce"]["paramedics"], data)


def add_police_officer(data): return _add_record(db["taskforce"]["police"], data)


def add_firefighter(data): return _add_record(db["taskforce"]["firefighters"], data)


def add_volunteer(data): return _add_record(db["volunteers"], data)


def add_admin(data): return _add_record(db["admins"], data)


def add_citizen(data): return _add_record(db["citizens"], data)


# --- Functions for Admin Panel API ---
def get_all_data():
    """
    Returns the entire user database for the admin panel.
    """
    return db


def admin_add_record(category, sub_category, data):
    """
    Adds a USER record from the admin panel.
    """
    record = None
    error_msg = None
    target_list = None

    if category == "taskforce" and sub_category:
        if sub_category in db["taskforce"]:
            target_list = db["taskforce"][sub_category]
        else:
            error_msg = "Invalid taskforce subcategory"
    elif category in db and isinstance(db[category], list):
        target_list = db[category]
    else:
        error_msg = "Invalid category"

    if target_list is not None:
        record, error_msg = _add_record(target_list, data)
    elif not error_msg:
        error_msg = "Target list not found"

    return record, error_msg


# --- Part 3: Flask App Server (from api.py) ---

app = Flask(__name__)
CORS(app)

# Instantiate the Blockchain
blockchain = Blockchain()

ADMIN_OTP_STORE = {
    'username': None,
    'code': None,
    'expires_at': 0,
}


def _generate_admin_otp():
    return f"{random.randint(100000, 999999)}"


# --- Part 4b: Admin OTP Utilities ---
def _set_admin_otp(username, code, expires_at):
    ADMIN_OTP_STORE['username'] = username
    ADMIN_OTP_STORE['code'] = code
    ADMIN_OTP_STORE['expires_at'] = expires_at


def _clear_admin_otp():
    ADMIN_OTP_STORE['username'] = None
    ADMIN_OTP_STORE['code'] = None
    ADMIN_OTP_STORE['expires_at'] = 0


# --- Part 4: HTML Template for Admin UI ---
ADMIN_UI_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Master Admin Panel</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { background-color: #111827; color: #d1d5db; font-family: sans-serif; }
        .card { background-color: #1f2937; border: 1px solid #374151; }
        .btn { transition: background-color 0.2s; }
        .table th, .table td { border-bottom: 1px solid #374151; padding: 12px 15px; }
        .table th { background-color: #374151; text-align: left; }
        .btn-delete { background-color: #ef4444; color: white; } .btn-delete:hover { background-color: #dc2626; }
        .btn-edit { background-color: #f59e0b; color: white; } .btn-edit:hover { background-color: #d97706; }
        .btn-add { background-color: #2563eb; color: white; } .btn-add:hover { background-color: #1d4ed8; }
        .btn-secondary { background-color: #10b981; color: white; } .btn-secondary:hover { background-color: #059669; }
        .btn-neutral { background-color: #6b7280; color: white; } .btn-neutral:hover { background-color: #4b5563; }
        input, select, textarea { background-color: #374151; border: 1px solid #4b5563; color: white; padding: 10px; border-radius: 0.375rem; width: 100%; }
        label { margin-bottom: 0.5rem; display: block; font-weight: 500;}
        pre { background-color: #0f172a; padding: 1rem; border-radius: 0.5rem; color: #93c5fd; overflow-x: auto; font-size: 0.8em; white-space: pre-wrap; word-wrap: break-word; }
        .modal { display: none; position: fixed; z-index: 10; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6); }
        .modal-content { background-color: #1f2937; margin: 10% auto; padding: 25px; border: 1px solid #374151; width: 80%; max-width: 600px; border-radius: 0.5rem; }
        .close { color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer; }
        .close:hover, .close:focus { color: #fff; text-decoration: none; }
    </style>
</head>
<body class="p-4 md:p-8">
    <h1 class="text-3xl md:text-4xl font-bold text-center mb-8 text-white">Master User Database Panel</h1>
    <!-- Add/Edit User Modal (Modal 1) -->
    <div id="editUserModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('editUserModal')">&times;</span>
            <h2 id="modalUserTitle" class="text-2xl font-semibold mb-4 text-white">Add/Edit User</h2>
            <form id="editUserForm" class="space-y-4">
                <input type="hidden" id="edit-id">
                <input type="hidden" id="edit-category">
                <input type="hidden" id="edit-subCategory">
                <input type="hidden" id="original-username">
                <div><label for="edit-username">Username</label><input type="text" id="edit-username" required></div>
                <div><label for="edit-password">Password (leave blank to keep current for edits)</label><input type="password" id="edit-password"></div>
                <div><label for="edit-fullName">Full Name</label><input type="text" id="edit-fullName"></div>
                <div id="dynamic-user-fields" class="space-y-4"></div>
                <button type="submit" class="btn btn-add w-full py-2.5">Save User Record</button>
            </form>
        </div>
    </div>
    <!-- Main Content Grid -->
    <div class="max-w-7xl mx-auto space-y-12">
        <!-- User Database Section -->
        <div>
            <h2 class="text-3xl font-semibold mb-4 text-white">User Database</h2>
            <div class="card p-6 rounded-lg mb-6 flex justify-center">
                 <button onclick="openAddModal()" class="btn btn-add font-medium rounded-lg text-sm px-5 py-2.5">Add New User</button>
            </div>
            <div id="db-view" class="space-y-6">
                <p class="text-center text-xl">Loading user database...</p>
            </div>
        </div>

        <!-- Blockchain View Section -->
        <div>
            <h2 class="text-3xl font-semibold mb-4 text-white">Blockchain Network</h2>
            <div class="card p-6 rounded-lg space-y-5">
                <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p class="text-gray-300 text-sm uppercase tracking-wide">Total Blocks</p>
                        <p class="text-3xl font-bold text-white"><span id="blockchain-length">0</span></p>
                    </div>
                    <div class="flex flex-wrap gap-3">
                        <button onclick="fetchBlockchain(true)" class="btn btn-neutral font-medium rounded-lg text-sm px-5 py-2.5">Refresh Blockchain</button>
                        <button id="validate-chain-btn" onclick="validateBlockchain()" class="btn btn-secondary font-medium rounded-lg text-sm px-5 py-2.5">Validate Blockchain</button>
                    </div>
                </div>
                <p id="blockchain-status" class="text-sm text-gray-400 min-h-[1.5rem]"></p>
                <div id="blockchain-view" class="space-y-4 max-h-[32rem] overflow-y-auto pr-1">
                    <p class="text-center text-xl text-gray-400">Loading blockchain...</p>
                </div>
            </div>
        </div>
    </div>
    <script>
        // --- ADMIN PANEL JAVASCRIPT ---
        const API_URL = window.location.origin;
        async function fetchAllData() {
            try {
                const response = await fetch(`${API_URL}/data`); 
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                renderUserData(data);
            } catch (error) {
                document.getElementById('db-view').innerHTML = `<p class="text-center text-red-500">Error loading data: ${error.message}</p>`;
                console.error("Fetch error:", error);
            }
        }
        async function deleteUser(category, subCategory, id) {
            if (!confirm('Are you sure you want to delete this USER record?')) return;
            const path = subCategory ? `${category}/${subCategory}` : category;
            try {
                const response = await fetch(`${API_URL}/delete/${path}/${id}`, { method: 'DELETE' });
                const result = await response.json();
                if (result.status !== 'success') alert('Error deleting record: ' + result.message);
                fetchAllData();
            } catch (error) {
                alert('Error connecting to server for deletion.');
            }
        }
        function openAddModal() {
            document.getElementById('editUserForm').reset();
            document.getElementById('edit-id').value = '';
            document.getElementById('original-username').value = '';
            document.getElementById('modalUserTitle').innerText = 'Add New User';
            document.getElementById('dynamic-user-fields').innerHTML = `
                 <div>
                    <label for="add-type">Type</label>
                    <select id="add-type" onchange="updateDynamicFields(this.value)" required>
                        <option value="">Select Type...</option>
                        <option value="paramedics">Paramedic</option>
                        <option value="police">Police Officer</option>
                        <option value="firefighters">Firefighter</option>
                        <option value="volunteers">Volunteer</option>
                        <option value="citizens">Citizen</option>
                        <option value="admins">Admin</option>
                    </select>
                </div>
            `;
            document.getElementById('edit-password').required = true;
            document.getElementById('editUserModal').style.display = 'block';
        }
        function openEditModal(category, subCategory, id, userData) {
            document.getElementById('editUserForm').reset();
            document.getElementById('modalUserTitle').innerText = 'Edit User Record';
            document.getElementById('edit-id').value = id;
            document.getElementById('edit-category').value = category;
            document.getElementById('edit-subCategory').value = subCategory || '';
            document.getElementById('original-username').value = userData.username || '';
            document.getElementById('edit-username').value = userData.username || '';
            document.getElementById('edit-fullName').value = userData.fullName || '';
            document.getElementById('edit-password').required = false;
            document.getElementById('edit-password').placeholder = "Leave blank to keep current";
            const type = subCategory || category;
            document.getElementById('dynamic-user-fields').innerHTML = '';
            // For taskforce, pass details. For others, pass the whole user object
            const detailsData = (category === 'taskforce') ? userData.details : userData;
            updateDynamicFields(type, detailsData || {});
            document.getElementById('editUserModal').style.display = 'block';
        }
         function updateDynamicFields(type, data = {}) {
            const container = document.getElementById('dynamic-user-fields');
            const isAddModal = !document.getElementById('edit-id').value;
             if (!isAddModal) container.innerHTML = '';
             else if (container.children.length > 1) {
                 while (container.children.length > 1) container.removeChild(container.lastChild);
             }
            let fieldsHtml = '';

            // Handle 'profession' field
            if (type !== 'admins' && type !== 'citizens' && type) {
                 const defaultProfession = type ? type.charAt(0).toUpperCase() + type.slice(1, -1) : '';
                 fieldsHtml += `<div><label for="edit-profession">Profession/Role</label><input type="text" id="edit-profession" value="${data.profession || defaultProfession}" required></div>`;
            } else if (type === 'citizens') {
                 fieldsHtml += `<div><label for="edit-profession">Profession/Role</label><input type="text" id="edit-profession" value="${data.profession || 'Citizen'}"></div>`;
            }

            // Taskforce-specific fields
            if (type === 'paramedics') {
                fieldsHtml += `<div><label for="edit-medicalField">Medical Field</label><input type="text" id="edit-medicalField" value="${data.medicalField || ''}"></div>`;
                fieldsHtml += `<div><label for="edit-jobExperience">Job Experience</label><input type="text" id="edit-jobExperience" value="${data.jobExperience || ''}"></div>`;
            } else if (type === 'police') {
                fieldsHtml += `<div><label for="edit-rank">Rank</label><input type="text" id="edit-rank" value="${data.rank || ''}"></div>`;
                fieldsHtml += `<div><label for="edit-stationPosting">Station Posting</label><input type="text" id="edit-stationPosting" value="${data.stationPosting || ''}"></div>`;
            } else if (type === 'firefighters') {
                fieldsHtml += `<div><label for="edit-currentStation">Current Station</label><input type="text" id="edit-currentStation" value="${data.currentStation || ''}"></div>`;
                fieldsHtml += `<div><label for="edit-workExperience">Work Experience</label><input type="text" id="edit-workExperience" value="${data.workExperience || ''}"></div>`;
            } 
            // Citizen-specific fields (now flat)
            else if (type === 'citizens') {
                 fieldsHtml += `<div><label for="edit-phone1">Phone 1</label><input type="text" id="edit-phone1" value="${data.phone1 || ''}"></div>`;
                 fieldsHtml += `<div><label for="edit-address">Address</label><textarea id="edit-address">${data.address || ''}</textarea></div>`;
            }
            // Volunteer-specific fields (now flat)
            else if (type === 'volunteers') {
                 fieldsHtml += `<div><label for="edit-phone">Phone</label><input type="text" id="edit-phone" value="${data.phone || ''}"></div>`;
                 fieldsHtml += `<div><label for="edit-aadhar">Aadhar</label><input type="text" id="edit-aadhar" value="${data.aadhar || ''}"></div>`;
            }

            container.innerHTML += fieldsHtml;
        }
        async function handleUserFormSubmit(event) {
            event.preventDefault();
            const id = document.getElementById('edit-id').value;
            const username = document.getElementById('edit-username').value;
            const password = document.getElementById('edit-password').value;
            const fullName = document.getElementById('edit-fullName').value;
            const originalUsername = document.getElementById('original-username').value;
            let recordData = { username, fullName };
            let apiUrl;
            let method = 'POST';
            let type;

            if (id) {
                 // --- EDIT LOGIC ---
                 method = 'PUT';
                 apiUrl = `${API_URL}/update/${originalUsername}`; 
                 if (password) recordData.password = password;
                 const category = document.getElementById('edit-category').value;
                 const subCategory = document.getElementById('edit-subCategory').value;
                 type = subCategory || category;

                 let details = {};
                 if (type !== 'admins' && type !== 'citizens') recordData.profession = document.getElementById('edit-profession')?.value;
                 else if (type === 'citizens') recordData.profession = document.getElementById('edit-profession')?.value;

                 if (type === 'paramedics') {
                    details.medicalField = document.getElementById('edit-medicalField')?.value;
                    details.jobExperience = document.getElementById('edit-jobExperience')?.value;
                 } else if (type === 'police') {
                    details.rank = document.getElementById('edit-rank')?.value;
                    details.stationPosting = document.getElementById('edit-stationPosting')?.value;
                 } else if (type === 'firefighters') {
                    details.currentStation = document.getElementById('edit-currentStation')?.value;
                    details.workExperience = document.getElementById('edit-workExperience')?.value;
                 } else if (type === 'citizens') {
                     details.phone1 = document.getElementById('edit-phone1')?.value;
                     details.address = document.getElementById('edit-address')?.value;
                 } else if (type === 'volunteers') {
                     details.phone = document.getElementById('edit-phone')?.value;
                     details.aadhar = document.getElementById('edit-aadhar')?.value;
                 }

                 if (category === 'taskforce') recordData.details = details;
                 else Object.assign(recordData, details); // Flatten for citizen/volunteer

            } else {
                // --- ADD LOGIC ---
                const typeSelect = document.getElementById('add-type');
                if (!typeSelect || !typeSelect.value) { alert("Please select a user type."); return; }
                if (!password) { alert("Password is required for new users."); return; }
                recordData.password = password;
                type = typeSelect.value;
                let categoryPath = type;
                let details = {};

                if (type !== 'admins' && type !== 'citizens') recordData.profession = document.getElementById('edit-profession')?.value;
                else if (type === 'citizens') recordData.profession = document.getElementById('edit-profession')?.value;

                 if (type === 'paramedics' || type === 'police' || type === 'firefighters') {
                     // Taskforce: data goes into 'details'
                     categoryPath = `taskforce/${type}`;
                     if (type === 'paramedics') {
                        details.medicalField = document.getElementById('edit-medicalField')?.value;
                        details.jobExperience = document.getElementById('edit-jobExperience')?.value;
                    } else if (type === 'police') {
                         details.rank = document.getElementById('edit-rank')?.value;
                        details.stationPosting = document.getElementById('edit-stationPosting')?.value;
                    } else if (type === 'firefighters') {
                         details.currentStation = document.getElementById('edit-currentStation')?.value;
                        details.workExperience = document.getElementById('edit-workExperience')?.value;
                    }
                     recordData.details = details;
                 } else if (type === 'citizens' || type === 'volunteers') {
                     // Citizen/Volunteer: data is flattened
                     categoryPath = type;
                     if (type === 'citizens') {
                         recordData.phone1 = document.getElementById('edit-phone1')?.value;
                         recordData.address = document.getElementById('edit-address')?.value;
                     } else if (type === 'volunteers') {
                         recordData.phone = document.getElementById('edit-phone')?.value;
                         recordData.aadhar = document.getElementById('edit-aadhar')?.value;
                     }
                 }
                apiUrl = `${API_URL}/add/${categoryPath}`;
            }

            try {
                const response = await fetch(apiUrl, { method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(recordData) });
                const result = await response.json();
                if (result.status !== 'success') alert(`Error saving user: ${result.message}`);
                else {
                    closeModal('editUserModal');
                    fetchAllData();
                }
            } catch (error) { alert('Error connecting to server for saving user.'); }
        }
        function renderUserData(data) {
            const container = document.getElementById('db-view');
            container.innerHTML = '';
            const categories = [
                { key: 'admins', title: 'Admins', isTaskforce: false },
                { key: 'taskforce', title: 'Taskforce', isTaskforce: true },
                { key: 'volunteers', title: 'Volunteers', isTaskforce: false },
                { key: 'citizens', title: 'Citizens', isTaskforce: false }
            ];
            let contentFound = false;
            categories.forEach(({ key: category, title: categoryTitle, isTaskforce }) => {
                let records = [];
                if (isTaskforce) {
                    records = [
                        ...(data.taskforce?.paramedics || []).map(r => ({...r, subCategory: 'paramedics'})),
                        ...(data.taskforce?.police || []).map(r => ({...r, subCategory: 'police'})),
                        ...(data.taskforce?.firefighters || []).map(r => ({...r, subCategory: 'firefighters'}))
                    ];
                } else records = data[category] || [];
                if (records.length === 0) return;
                contentFound = true;
                let tableHtml = `<div class="card p-4 md:p-6 rounded-lg mb-6"><h3 class="text-xl md:text-2xl font-semibold mb-4 text-white">${categoryTitle}</h3><div class="overflow-x-auto"><table class="w-full text-sm text-left table"><thead><tr>
                    <th class="px-4 py-3">Username</th>${isTaskforce ? '<th class="px-4 py-3">Type</th>' : ''}
                    <th class="px-4 py-3">Full Name</th><th class="px-4 py-3">Details</th><th class="px-4 py-3">Actions</th>
                    </tr></thead><tbody>`;
                records.forEach(record => {
                    const editData = {...record}; const recordId = record.id;
                    const subCategory = record.subCategory || null;
                    const categoryName = isTaskforce ? 'taskforce' : category;
                    delete editData.id; delete editData.subCategory;

                    // Prepare details for <pre> tag
                    let detailsToShow = {};
                    if (isTaskforce) {
                        detailsToShow = record.details || {};
                    } else {
                        // For flat objects, copy all keys *except* core ones
                        const coreKeys = ['id', 'username', 'password', 'fullName', 'profession'];
                        for (const key in record) {
                            if (!coreKeys.includes(key)) {
                                detailsToShow[key] = record[key];
                            }
                        }
                    }

                    const displayUsername = record.username || 'N/A';
                    tableHtml += `
                        <tr class="border-b border-gray-700 hover:bg-gray-700/50">
                            <td class="px-4 py-4 font-medium">${displayUsername}</td>
                            ${isTaskforce ? `<td class="px-4 py-4 capitalize">${subCategory || 'N/A'}</td>` : ''}
                            <td class="px-4 py-4">${record.fullName || 'N/A'}</td>
                            <td class."px-4 py-4"><pre>${JSON.stringify(detailsToShow, null, 2)}</pre></td>
                             <td class="px-4 py-4 space-x-2 whitespace-nowrap">
                                <button onclick='openEditModal("${categoryName}", "${subCategory || ''}", "${recordId}", ${JSON.stringify(editData)})' class="btn btn-edit rounded px-3 py-1 text-xs">Edit</button>
                                <button onclick="deleteUser('${categoryName}', '${subCategory || ''}', '${recordId}')" class="btn btn-delete rounded px-3 py-1 text-xs">Delete</button>
                            </td>
                        </tr>`;
                });
                tableHtml += '</tbody></table></div></div>';
                container.innerHTML += tableHtml;
            });
            if (!contentFound) container.innerHTML = '<p class="text-center text-xl text-gray-400">User database is empty.</p>';
        }

        // --- BLOCKCHAIN HELPERS ---
        function formatTimestamp(seconds) {
            if (seconds === undefined || seconds === null) return 'N/A';
            try {
                return new Date(seconds * 1000).toLocaleString();
            } catch (error) {
                return 'N/A';
            }
        }

        function renderBlockchain(chain) {
            const container = document.getElementById('blockchain-view');
            if (!container) return;

            container.innerHTML = '';
            if (!Array.isArray(chain) || chain.length === 0) {
                container.innerHTML = '<p class="text-center text-xl text-gray-400">Blockchain is empty.</p>';
                return;
            }

            const blocks = [...chain].reverse();
            const blockMarkup = blocks.map(block => {
                const emergenciesHtml = Array.isArray(block.emergencies) && block.emergencies.length > 0
                    ? block.emergencies.map(emergency => {
                        const resources = Array.isArray(emergency.resources) && emergency.resources.length
                            ? emergency.resources.join(', ')
                            : 'N/A';
                        let locationDisplay = 'N/A';
                        if (Array.isArray(emergency.location) && emergency.location.length === 2) {
                            const lat = Number(emergency.location[0]);
                            const lng = Number(emergency.location[1]);
                            if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
                                locationDisplay = `Lat: ${lat.toFixed(4)}, Lon: ${lng.toFixed(4)}`;
                            }
                        }
                        return `
                            <div class="border border-gray-700 rounded-lg p-3 bg-gray-900/60">
                                <p class="text-sm text-gray-300"><span class="font-semibold">Reporter:</span> ${emergency.sender || 'N/A'}</p>
                                <p class="text-sm text-gray-300"><span class="font-semibold">Details:</span> ${emergency.details || 'N/A'}</p>
                                <p class="text-sm text-gray-300"><span class="font-semibold">Location:</span> ${locationDisplay}</p>
                                <p class="text-sm text-gray-300"><span class="font-semibold">Resources:</span> ${resources}</p>
                                <p class="text-xs text-gray-500">Reported: ${formatTimestamp(emergency.timestamp)}</p>
                            </div>
                        `;
                    }).join('')
                    : '<p class="text-sm text-gray-400">No emergencies in this block.</p>';

                return `
                    <div class="card p-4 md:p-6 rounded-lg border border-gray-700 bg-gray-900/60">
                        <div class="flex flex-wrap items-center justify-between gap-3">
                            <h3 class="text-xl font-semibold text-white">Block #${block.index ?? 'N/A'}</h3>
                            <span class="text-xs uppercase tracking-wide text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/30">Proof ${block.proof ?? 'N/A'}</span>
                        </div>
                        <div class="mt-4 space-y-2 text-sm text-gray-300">
                            <p><span class="font-semibold">Timestamp:</span> ${formatTimestamp(block.timestamp)}</p>
                            <p class="break-all"><span class="font-semibold">Hash:</span> ${block.hash || 'N/A'}</p>
                            <p class="break-all"><span class="font-semibold">Previous Hash:</span> ${block.previous_hash || 'N/A'}</p>
                        </div>
                        <div class="mt-4 space-y-3">
                            <h4 class="text-sm font-semibold text-gray-200 uppercase tracking-wide">Emergencies</h4>
                            ${emergenciesHtml}
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = blockMarkup;
        }

        async function fetchBlockchain(showStatus = false) {
            const statusEl = document.getElementById('blockchain-status');
            const lengthEl = document.getElementById('blockchain-length');

            if (showStatus && statusEl) {
                statusEl.innerText = 'Refreshing blockchain...';
                statusEl.classList.remove('text-red-500', 'text-green-400');
            }

            try {
                const response = await fetch(`${API_URL}/chain`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const data = await response.json();
                renderBlockchain(data.chain);
                if (lengthEl) {
                    const reportedLength = typeof data.length === 'number' ? data.length : (Array.isArray(data.chain) ? data.chain.length : 0);
                    lengthEl.innerText = reportedLength;
                }
                if (statusEl && showStatus) {
                    statusEl.innerText = 'Blockchain updated.';
                    statusEl.classList.add('text-green-400');
                    setTimeout(() => {
                        statusEl.innerText = '';
                        statusEl.classList.remove('text-green-400');
                    }, 3000);
                } else if (statusEl && !showStatus) {
                    statusEl.innerText = '';
                    statusEl.classList.remove('text-green-400', 'text-red-500');
                }
            } catch (error) {
                if (statusEl) {
                    statusEl.innerText = `Error loading blockchain: ${error.message}`;
                    statusEl.classList.add('text-red-500');
                    statusEl.classList.remove('text-green-400');
                }
                console.error("Fetch blockchain error:", error);
            }
        }

        async function validateBlockchain() {
            const statusEl = document.getElementById('blockchain-status');
            const lengthEl = document.getElementById('blockchain-length');
            const buttonEl = document.getElementById('validate-chain-btn');

            if (buttonEl) {
                buttonEl.disabled = true;
            }
            if (statusEl) {
                statusEl.innerText = 'Validating blockchain...';
                statusEl.classList.remove('text-red-500', 'text-green-400');
            }

            try {
                const response = await fetch(`${API_URL}/nodes/resolve`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const data = await response.json();
                if (statusEl) {
                    statusEl.innerText = data.message || 'Consensus completed.';
                    statusEl.classList.add('text-green-400');
                }
                if (Array.isArray(data.chain)) {
                    renderBlockchain(data.chain);
                }
                if (lengthEl && typeof data.length === 'number') {
                    lengthEl.innerText = data.length;
                }
            } catch (error) {
                if (statusEl) {
                    statusEl.innerText = `Error validating blockchain: ${error.message}`;
                    statusEl.classList.add('text-red-500');
                    statusEl.classList.remove('text-green-400');
                }
            } finally {
                if (buttonEl) {
                    buttonEl.disabled = false;
                }
                if (statusEl) {
                    setTimeout(() => {
                        statusEl.innerText = '';
                        statusEl.classList.remove('text-green-400', 'text-red-500');
                    }, 6000);
                }
            }
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }
        document.getElementById('editUserForm').addEventListener('submit', handleUserFormSubmit);
        document.addEventListener('DOMContentLoaded', () => {
            fetchAllData();
            fetchBlockchain();
        });
        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        }
    </script>
</body>
</html>
"""


# --- Part 5: Admin API Endpoints ---
# (These endpoints are for the Admin HTML page)

@app.route('/')
def admin_ui():
    """Serves the main admin HTML page."""
    return render_template_string(ADMIN_UI_TEMPLATE)


@app.route('/data', methods=['GET'])
def get_all_data_route():
    """Returns all user data for the admin panel."""
    return jsonify(get_all_data())


@app.route('/add/<category>', methods=['POST'])
@app.route('/add/<category>/<sub_category>', methods=['POST'])
def admin_add_record_route(category, sub_category=None):
    """Adds a USER record from the admin panel."""
    data = request.get_json()
    record, error_msg = admin_add_record(category, sub_category, data)
    if record:
        return jsonify({"status": "success", "data": record}), 201
    return jsonify({"status": "error", "message": error_msg or "Failed to add record"}), 400


@app.route('/update/<username>', methods=['PUT'])
def admin_update_record_route(username):
    """Updates a USER record from the admin panel."""
    data_to_update = request.get_json()
    user, error_msg = update_user_record(username, data_to_update)
    if user:
        return jsonify({"status": "success", "data": user}), 200
    return jsonify({"status": "error", "message": error_msg}), 404


@app.route('/delete/<category>/<record_id>', methods=['DELETE'])
@app.route('/delete/<category>/<sub_category>/<record_id>', methods=['DELETE'])
def admin_delete_record_route(category, record_id, sub_category=None):
    """Deletes a USER record by ID from the admin panel."""
    success, error_msg = delete_user_by_id(category, sub_category, record_id)
    if success:
        return jsonify({"status": "success"}), 200
    return jsonify({"status": "error", "message": error_msg or "Failed to delete record"}), 404


# --- Part 6: Frontend API Endpoints (Registration & Login) ---

@app.route('/register/taskforce', methods=['POST'])
def register_taskforce_route():
    data = request.get_json()
    print("Received /register/taskforce data:", data)
    profession = data.get('profession')

    if profession == 'Police':
        record, error_msg = add_police_officer(data)
    elif profession == 'Paramedic':
        record, error_msg = add_paramedic(data)
    elif profession == 'Firefighter':
        record, error_msg = add_firefighter(data)
    else:
        record, error_msg = None, f"Invalid profession: {profession}"

    if record: return jsonify({"status": "success", "data": record}), 201
    return jsonify({"status": "error", "message": error_msg or "Failed to register"}), 400


@app.route('/register/citizen', methods=['POST'])
def register_citizen_route():
    data = request.get_json()
    print("Received /register/citizen data:", data)

    # Normalize data: move 'details' content to the top level
    if 'details' in data and isinstance(data['details'], dict):
        details = data.pop('details')
        data.update(details)

    record, error_msg = add_citizen(data)
    if record: return jsonify({"status": "success", "data": record}), 201
    return jsonify({"status": "error", "message": error_msg or "Failed to register"}), 400


@app.route('/register/volunteer', methods=['POST'])
def register_volunteer_route():
    data = request.get_json()
    print("Received /register/volunteer data:", data)

    # Normalize data: move 'details' content to the top level
    if 'details' in data and isinstance(data['details'], dict):
        details = data.pop('details')
        data.update(details)

    record, error_msg = add_volunteer(data)
    if record: return jsonify({"status": "success", "data": record}), 201
    return jsonify({"status": "error", "message": error_msg or "Failed to register"}), 400


@app.route('/login', methods=['POST'])
def login_route():
    data = request.get_json()
    username, password = data.get('username'), data.get('password')
    if not username or not password:
        return jsonify({'status': 'error', 'message': 'Username and password are required.'}), 400

    user, category_path, _ = find_user_by_username(username)

    if user and user.get('password') == password:  # UNSAFE password check

        print(f"--- User '{username}' Logged In Successfully ({category_path}) ---")

        # Return only safe data to the frontend
        safe_user_data = {
            'fullName': user.get('fullName'),
            'profession': user.get('profession'),
            'username': user.get('username')
        }
        # Also return taskforce details if they exist
        if 'details' in user:
            safe_user_data['details'] = user.get('details')

        return jsonify({
            'status': 'success',
            'message': 'Login successful!',
            'user': safe_user_data
        }), 200

    print(f"Login failed: Invalid credentials for user '{username}'")
    return jsonify({'status': "error", 'message': 'Invalid username or password.'}), 401


# --- Part 7: DApp/Blockchain API Endpoints ---
@app.route('/nodes/register', methods=['POST'])
def register_nodes():
    """
    Registers new nodes with the blockchain.
    """
    values = request.get_json() or {}
    nodes = values.get('nodes')
    if not nodes or not isinstance(nodes, list):
        return jsonify({'message': 'Please supply a valid list of node URLs.'}), 400

    added_nodes = []
    skipped_nodes = []

    for node in nodes:
        try:
            blockchain.register_node(node)
            added_nodes.append(node)
        except ValueError:
            skipped_nodes.append(node)

    response = {
        'message': 'Nodes registered successfully.' if added_nodes else 'No valid nodes were registered.',
        'total_nodes': sorted(blockchain.nodes),
        'added_nodes': added_nodes
    }
    if skipped_nodes:
        response['skipped_nodes'] = skipped_nodes

    status_code = 201 if added_nodes else 400
    return jsonify(response), status_code


@app.route('/nodes/resolve', methods=['GET'])
def consensus():
    """
    Runs the consensus algorithm to resolve conflicts.
    """
    replaced = blockchain.resolve_conflicts()

    response = {
        'message': 'Chain replaced' if replaced else 'Chain is authoritative',
        'chain': blockchain.chain,
        'length': len(blockchain.chain)
    }
    return jsonify(response), 200


@app.route('/admin/otp/request', methods=['POST'])
def admin_request_otp():
    """
    Generates a one-time code for admin access after basic credential verification.
    """
    values = request.get_json() or {}
    username = values.get('username')
    password = values.get('password')

    if not username or not password:
        return jsonify({'status': 'error', 'message': 'Username and password are required.'}), 400

    user, category, _ = find_user_by_username(username)
    if not user or category != 'admins' or user.get('password') != password:
        return jsonify({'status': 'error', 'message': 'Invalid admin credentials.'}), 401

    otp_code = _generate_admin_otp()
    _set_admin_otp(username, otp_code, time.time() + 300)  # 5 minute expiry

    # NOTE: For demonstration we include the OTP in the response.
    # In production, send via email/SMS instead.
    return jsonify({
        'status': 'success',
        'message': 'OTP generated successfully. It expires in 5 minutes.',
        'otp_code': otp_code
    }), 200


@app.route('/admin/otp/verify', methods=['POST'])
def admin_verify_otp():
    """
    Verifies the admin OTP before providing panel access.
    """
    values = request.get_json() or {}
    username = values.get('username')
    otp = values.get('otp')

    if not username or not otp:
        return jsonify({'status': 'error', 'message': 'Username and OTP are required.'}), 400

    stored_username = ADMIN_OTP_STORE.get('username')
    stored_code = ADMIN_OTP_STORE.get('code')
    expires_at = ADMIN_OTP_STORE.get('expires_at', 0)

    if username != stored_username or stored_code is None:
        return jsonify({'status': 'error', 'message': 'No active OTP session. Request a new code.'}), 400

    if time.time() > expires_at:
        _clear_admin_otp()
        return jsonify({'status': 'error', 'message': 'OTP has expired. Please request a new one.'}), 400

    if otp != stored_code:
        return jsonify({'status': 'error', 'message': 'Invalid OTP supplied.'}), 401

    _clear_admin_otp()
    return jsonify({'status': 'success', 'message': 'OTP verified. Access granted.'}), 200


@app.route('/mine', methods=['POST'])
def mine():
    """
    Mines a new block, adding all current emergencies.
    """
    last_block = blockchain.last_block
    last_proof = last_block['proof']
    proof = blockchain.proof_of_work(last_proof)
    previous_hash = blockchain.hash(last_block)
    block = blockchain.new_block(proof, previous_hash)
    response = {'message': "New Block Mined", **block}
    return jsonify(response), 200


@app.route('/emergencies/new', methods=['POST'])
def new_emergency_report():
    """
    Receives new emergency data from the frontend and returns the index of the block that will store it.
    """
    values = request.get_json()
    required = ['sender', 'details', 'location', 'resources']
    if not all(k in values for k in required):
        return 'Missing values (sender, details, location, resources)', 400
    if not isinstance(values['location'], list) or len(values['location']) != 2:
        return 'Location must be a list of [latitude, longitude]', 400

    # Add the emergency to the list of current emergencies
    index = blockchain.new_emergency(
        values['sender'],
        values['details'],
        values['location'],
        values['resources']
    )
    response = {
        'message': f'Emergency report will be added to Block {index}',
        'block_index': index
    }
    return jsonify(response), 201


@app.route('/chain', methods=['GET'])
def full_chain():
    """
    Returns the full blockchain.
    """
    response = {'chain': blockchain.chain, 'length': len(blockchain.chain)}
    return jsonify(response), 200


# --- Part 8: Main Execution ---
if __name__ == '__main__':
    print("--- Starting Emergency Hub MASTER Server (Single File) ---")
    print("All logic (Blockchain, Auth, API) is in this file.")
    print("Admin Panel: http://127.0.0.1:5000")
    print("API running on: http://127.0.0.1:5000")
    print("-------------------------------------------------")
    # Run the app on the correct host for frontend access
    app.run(host='127.0.0.1', port=5000, debug=True)