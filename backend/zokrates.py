import subprocess

def zokrates_init(PATH_TO_EXECUTABLE, ships_positions):
    
    subprocess.run([
        f"{PATH_TO_EXECUTABLE}",
        "compile",
        "-i",
        "initialize/init.zok;",
        "zokrates",
        "setup;",
        "zokrates",
        "export-verifier;",
        "zokrates",
        "compute-witness",
        "-a",
        "{} {} {} {} {} {} {} {} {} {} {} {} {} {} {}  ;".format(*ships_positions),
        "zokrates",
        "generate-proof"
    ], shell=True)


def zokrates_move_validator(PATH_TO_EXECUTABLE, ships_positions, game_hash, coord_x, coord_y):
    
    subprocess.run([
        f"{PATH_TO_EXECUTABLE}",
        "compile",
        "-i",
        "handle_move/handle_move.zok;",
        "zokrates",
        "setup;",
        "zokrates",
        "export-verifier;",
        "zokrates",
        "compute-witness",
        "-a",
        "{} {} {} {} {} {} {} {} {} {} {} {} {} {} {} {} {} {} ;".format(*ships_positions, game_hash, coord_x, coord_y),
        "zokrates",
        "generate-proof"
    ], shell=True)