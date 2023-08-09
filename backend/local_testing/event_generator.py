import subprocess


def push_all_cells():
    for i in range(100):
        subprocess.run([
            "cast",
            "send",
            "--from", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "--unlocked", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
            "move(uint8, uint256)", f"{i}", "12"
        ])


if __name__ == "__main__":
    push_all_cells()
