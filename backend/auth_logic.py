import uuid
import json
import hashlib  # Keep this in case you enable password hashing

# --- Part 1: User Database ---
# This is now the central database, managed only by this file.
db = {
    "citizens": [],
    "taskforce": {
        "paramedics": [],
        "police": [],
        "firefighters": []
    },
    "volunteers": [],
    "admins": [],
}


# --- Part 2: Database Helper Functions ---
# (These are "private" to this module)
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


# --- Part 3: Public Auth/DB Functions ---
# (These are called by api.py)

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

