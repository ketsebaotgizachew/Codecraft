#These file is responsible for saving and loading html elements from disk
import os

import os
import time

def init_project_dir(projectdir, projectname):
    # Create the project directory
    os.makedirs(projectdir, exist_ok=True)

    # Create a text file with the project's name
    with open(os.path.join(projectdir, 'projectname.txt'), 'w') as f:
        f.write(projectname)

    # Create indexhtml.txt, stylescss.txt, and scriptjs.txt files
    for filename in ['indexhtml.txt', 'stylescss.txt', 'scriptjs.txt']:
        open(os.path.join(projectdir, filename), 'w').close()

    # Store the project's name and date in recent_projects
    history_dir = './project_history_files'
    os.makedirs(history_dir, exist_ok=True)
    history_file = os.path.join(history_dir, 'recent_projects.txt')

    # Read the existing projects
    if os.path.exists(history_file):
        with open(history_file, 'r') as f:
            projects = f.read().splitlines()
    else:
        projects = []

    # Format the current project's data
    current_project = f'{projectname} {time.strftime("%Y-%m-%d %H:%M:%S")}'

    # If the project already exists in the file, remove it
    projects = [p for p in projects if not p.startswith(f'{projectname} ')]

    # Add the current project to the top of the list
    projects.insert(0, current_project)

    # Write the projects back to the file
    with open(history_file, 'w') as f:
        f.write('\n'.join(projects))

    return None


def save_files(project_Name,project_Data,project_dir):
    # Create the full path to the file
    file_path = os.path.join(project_dir, 'indexhtml.txt')

    # Open the file in write mode (this will create the file if it doesn't exist)
    with open(file_path, 'w') as file:
        # Write the project data to the file
        file.write(project_Data)

def load_html(dir):
    # Specify the file name
    file_name = 'indexhtml.txt'

    # Create the full path to the file
    file_path = os.path.join(dir, file_name)

    # Open the file in read mode
    with open(file_path, 'r') as file:
        # Read the content of the file
        content = file.read()

    # Return the content of the file
    return content

def open_files(project_Name):
    project_Data = ""
    return project_Data

def list_Projects():
    projects = []
    return projects