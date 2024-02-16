from pyteal import *

def example_program():

    program = Seq([
        # Return success
        Int(1)
    ])

    return program

compiled_program = compileTeal(example_program(), mode=Mode.Application, version=4)
print(compiled_program)
