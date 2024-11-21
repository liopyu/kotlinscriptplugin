def generate_kotlin_file(num_vars: int, file_name: str = "generated_vars.kts"):
    with open(file_name, "w") as file:
        for i in range(1, num_vars + 1):
            file.write(f"val var{i} = {i}\n")
    print(f"File '{file_name}' with {num_vars} variables generated.")

# Customize the number of variables here
num_vars = 20000
generate_kotlin_file(num_vars)
