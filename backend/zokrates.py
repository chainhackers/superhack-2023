import subprocess

def zokrates_init(zokrates_path, work_dir, ships_positions):
    return subprocess.run(
        " ".join([
            f"{zokrates_path}",
            "compute-witness",
            "-a",
            *map(str, ships_positions),
            "&&",
            f"{zokrates_path}",
            "generate-proof",
        ]),
        shell=True,
        capture_output=True,
        cwd=work_dir
    )


def zokrates_move_validator(zokrates_path, work_dir, ships_positions, move):
    return subprocess.run(
        " ".join([
            f"{zokrates_path}",
            "compute-witness",
            "-a",
            *map(str, ships_positions),
            str(game_hash),
            str(move),
            "&&",
            f"{zokrates_path}",
            "generate-proof"
        ]),
        shell=True,
        capture_output=True,
        cwd=work_dir,
    )
