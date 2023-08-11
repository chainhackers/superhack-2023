import subprocess
import json

def zokrates_init(zokrates_path, work_dir, ships_positions):
    result = subprocess.run(
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
    if result.returncode == 0:
        with open(work_dir + "/proof.json", "r") as f:
            return json.load(f)


def zokrates_move_validator(zokrates_path, work_dir, ships_positions, game_digest, move):
    result = subprocess.run(
        " ".join([
            f"{zokrates_path}",
            "compute-witness",
            "-a",
            *map(str, ships_positions),
            str(game_digest),
            str(move),
            "&&",
            f"{zokrates_path}",
            "generate-proof"
        ]),
        shell=True,
        capture_output=True,
        cwd=work_dir,
    )
    if result.returncode == 0:
        with open(work_dir + "/proof.json", "r") as f:
            return json.load(f)
