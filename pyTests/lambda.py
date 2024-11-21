def generate_kotlin_file(num_lambdas: int, file_name: str = "generated_lambdas.kts"):
    with open(file_name, "w") as file:
        for i in range(1, num_lambdas + 1):
            file.write(f"val square{i}: (Int) -> Int = {{ x -> x * x }}\n")
    print(f"File '{file_name}' with {num_lambdas} lambda expressions generated.")

# Customize the number of lambda expressions here
num_lambdas = 20000
generate_kotlin_file(num_lambdas)
