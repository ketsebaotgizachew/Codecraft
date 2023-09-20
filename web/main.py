import eel

eel.init("web")

def write_config(project_name, num_pages):
    with open('config.txt', 'w') as file:
        file.write(f"Project Name: {project_name}\n")
        file.write(f"Number of Pages: {num_pages}\n")

def read_config():
    with open('config.txt', 'r') as file:
        lines = file.readlines()
        project_name = lines[0].split(': ')[1].strip()
        num_pages = int(lines[1].split(': ')[1].strip())

    return [(project_name, num_pages)]

eel.start("index.html")