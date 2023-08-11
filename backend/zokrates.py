import subprocess
import json


def zokrates_prove(zokrates_path, work_dir, *args):
    result = subprocess.run(
        " ".join([
            f"{zokrates_path}",
            "compute-witness",
            "-a",
            *map(str, args),
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
