import eel
from web.propject_managers.handle_project_files_so import  save_files , open_files, list_Projects, init_project_dir , load_html
#tikinter is needed to open file dealoges
from tkinter import Tk
from tkinter.filedialog import askdirectory


eel.init("web")

@eel.expose
def init_pr(projectdir,projectname):
    init_project_dir(projectdir,projectname)
@eel.expose
def sv_file(project_name, project_data,project_dir):
    save_files( project_name, project_data,project_dir)

@eel.expose
def op_file(project_name):
    open_files(project_name)

@eel.expose
def op_file_save_dialoge():
    return None

@eel.expose
def open_folder_dialoge():
    root = Tk()
    root.attributes('-topmost', True)  # Display the dialog in the foreground.
    root.iconify()  # Hide the little window.
    folder = askdirectory(title='...', parent=root)
    root.destroy()  # Destroy the root window when folder selected.
    return folder

@eel.expose
def l_html(project_dir):
    result = load_html(project_dir)
    return result

eel.start("index.html")