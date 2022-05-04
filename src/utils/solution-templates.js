const hint = '# Makefile используется для сборки и запуска вашего решения.\n' +
    '# После получения решения проверяющая система\n' +
    '# запускает команду внутри блока build (make build)\n' +
    '# В случае успешного выполнения команды из блока build\n' +
    '# Система выполняет команду из блока run (make run) для каждого теста,\n' +
    '# передавая в качестве STDIN данные из теста и проверяя ответ в STDOUT.\n' +
    '\n' +
    '# Доступные команды: gcc, g++, gfortran, fpc, go, lua, python3 + команды UNIX\n'

export default {
    'C': [
        {name: 'main.c', value: '#include <stdio.h>\n\nint main() {\n    printf(\"WOLF! AWOOOOOO!\");\n    return 0;\n}\n'},
        {name: 'Makefile', value: `${hint}\nbuild:\n\tgcc main.c -o solution\nrun:\n\t./solution`}
    ],
    'C++': [
        {name: 'main.cpp', value: '#include <iostream>\n\nint main() {\n    std::cout << \"WOLF! AWOOOOOO!\" << std::endl;\n    return 0;\n}\n'},
        {name: 'Makefile', value: `${hint}\nbuild:\n\tg++ main.cpp -o solution\nrun:\n\t./solution`}
    ],
    'Python3': [
        {name: 'main.py', value: 'if __name__ == \'__main__\':\n    print(\'WOLF! AWOOOOOO!\')\n'},
        {name: 'Makefile', value: `${hint}\nrun:\n\tpython3 main.py`}
    ],
    'Lua': [
        {name: 'main.lua', value: 'print(\'WOLF! AWOOOOOO!\');'},
        {name: 'Makefile', value: `${hint}\nrun:\n\tlua main.lua`}
    ],
    'Free Pascal': [
        {name: 'main.pas', value: 'begin\n    writeln(\'WOLF! AWOOOOOO!\');\nend.\n'},
        {name: 'Makefile', value: `${hint}\nbuild:\n\tfpc main.pas\nrun:\n\t./main`}
    ],
    'GoLang': [
        {name: 'main.go', value: 'package main\n\nimport \"fmt\"\n\nfunc main() {\n    fmt.Println(\"WOLF! AWOOOOOO!\")\n}\n'},
        {name: 'Makefile', value: `${hint}\nbuild:\n\tgo build main.go\nrun:\n\t./main`}
    ],
    'NASM': [
        {name: 'main.asm', value: 'section .data\n' +
                '    s:    db \'WOLF! AWOOOOOO!\', 10 ; 10 is code for \'\\n\'\n' +
                '\n' +
                'section .text\n' +
                '    global _start ; adding _start name to object code\n' +
                '\n' +
                '_start:\n' +
                '    mov eax, 4 ; system call \'write\'\n' +
                '    mov ebx, 1 ; write to stdout\n' +
                '    mov ecx, s ; string adr\n' +
                '    mov edx, 16 ; string len\n' +
                '    int 80h\n' +
                '\n' +
                '    mov eax, 1 ; system call \'exit\'\n' +
                '    mov ebx, 0 ; exit code\n' +
                '    int 80h\n'},
        {name: 'Makefile', value: `${hint}\nbuild:\n\tnasm -felf64 main.asm\n\tld main.o\nrun:\n\t./a.out`}
    ]
}
