const hint = '# Makefile используется для сборки и запуска вашего решения.\n' +
    '# После получения решения проверяющая система\n' +
    '# запускает команду внутри блока build (make build)\n' +
    '# В случае успешного выполнения команды из блока build\n' +
    '# Система выполняет команду из блока run (make run) для каждого теста,\n' +
    '# передавая в качестве STDIN данные из теста и проверяя ответ в STDOUT.\n' +
    '\n' +
    '# Доступные команды: gcc, g++, gfortran, fpc, go, lua, python3 + команды UNIX\n' +
    '\n' +
    '# Для отступов нельзя использовать пробелы - только символы табуляции ("\t")\n' +
    '\n';

export default {
    'C': [
        {name: 'main.c', value: '#include <stdio.h>\n\nint main() {\n    printf(\"WOLF! AWOOOOOO!\");\n    return 0;\n}\n'},
        {name: 'Makefile', value: `${hint}\nbuild:\n\tgcc main.c -o solution\nrun:\n\t./solution\n`}
    ],
    'C++': [
        {name: 'main.cpp', value: '#include <iostream>\n\nint main() {\n    std::cout << \"WOLF! AWOOOOOO!\" << std::endl;\n    return 0;\n}\n'},
        {name: 'Makefile', value: `${hint}\nbuild:\n\tg++ main.cpp -o solution\nrun:\n\t./solution\n`}
    ],
    'Python3': [
        {name: 'main.py', value: 'if __name__ == \'__main__\':\n    print(\'WOLF! AWOOOOOO!\')\n'},
        {name: 'Makefile', value: `${hint}\nrun:\n\tpython3 main.py\n`}
    ],
    'Lua': [
        {name: 'main.lua', value: 'print(\'WOLF! AWOOOOOO!\');'},
        {name: 'Makefile', value: `${hint}\nrun:\n\tlua main.lua\n`}
    ],
    'Free Pascal': [
        {name: 'main.pas', value: 'begin\n    writeln(\'WOLF! AWOOOOOO!\');\nend.\n'},
        {name: 'Makefile', value: `${hint}\nbuild:\n\tfpc main.pas\nrun:\n\t./main\n`}
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
        {name: 'Makefile', value: `${hint}\nbuild:\n\tnasm -felf64 main.asm\n\tld main.o\nrun:\n\t./a.out\n`}
    ],
    'NodeJS': [
        {name: 'main.js', value: 'console.log(\'WOLF! AWOOOOOO!\');\n'},
        {name: 'Makefile', value: `${hint}\nrun:\n\tnode main.js\n`}
    ],
    'C#': [
        {name: 'main.cs', value: 'using System;\n' +
                '\n' +
                'public class HelloWorld {\n' +
                '    public static void Main() {\n' +
                '        Console.WriteLine("WOLF! AWOOOOOO!");\n' +
                '    }\n' +
                '}\n'},
        {name: 'Makefile', value: `${hint}\nbuild:\n\tcsc main.cs -out:solution.exe\nrun:\n\tmono solution.exe\n`}
    ],
    'Java': [
        {name: 'main.java', value: 'class Solution {\n' +
                '    public static void main(String[] args) {\n' +
                '        System.out.println("WOLF! AWOOOOOO!");\n' +
                '    }\n' +
                '}'},
        {name: 'Makefile', value: `${hint}\n` +
                'build:\n' +
                '\tjavac main.java\n' +
                '\tjar cfe main.jar Solution ./*.class\n' +
                'run:\n' +
                '\tjava -jar main.jar\n'}
    ],
    'PHP': [
        {name: 'main.php', value: '<?php echo("WOLF! AWOOOOOO!"); ?>\n'},
        {name: 'Makefile', value: `${hint}\nrun:\n\tphp main.php\n`}
    ],
    'Bash': [
        {name: 'Makefile', value: `${hint}\nrun:\n\techo "WOLF! AWOOOOOO!"\n`}
    ],
    'Fortran': [
        {name: 'main.f90', value: 'program solution\n' +
                '  print *, \'WOLF! AWOOOOOO!\'\n' +
                'end program solution\n'},
        {name: 'Makefile', value: `${hint}\n` +
                'build:\n' +
                '\tgfortran main.f90 -o solution\n' +
                'run:\n' +
                '\t./solution\n'}
    ]
};
