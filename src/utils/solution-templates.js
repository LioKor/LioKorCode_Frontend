const hint = '# Makefile используется для сборки и запуска вашего решения.\n' +
    '# После получения решения проверяющая система\n' +
    '# запускает команду внутри блока build (make build)\n' +
    '# В случае успешного выполнения команды из блока build\n' +
    '# Система выполняет команду из блока run (make run) для каждого теста,\n' +
    '# передавая в качестве STDIN данные из теста и проверяя ответ в STDOUT.\n' +
    '\n' +
    '# Доступные команды: gcc, g++, gfortran, fpc, go, lua, python3 + команды UNIX\n'

export default {
    'c': [
        {name: 'main.c', value: 'int main() {\n\treturn 0;\n}\n'},
        {name: 'Makefile', value: `${hint}\nbuild:\n\tgcc main.c -o solution\nrun:\n\t./solution`}
    ],
    'cpp': [
        {name: 'main.cpp', value: 'int main() {\n\treturn 0;\n}\n'},
        {name: 'Makefile', value: `${hint}\nbuild:\n\tg++ main.cpp -o solution\nrun:\n\t./solution`}
    ],
    'python3': [
        {name: 'main.py', value: 'if __name__ == \'__main__\':\n    print(\'WOLF! AWUUUUUU\')\n'},
        {name: 'Makefile', value: `${hint}\nrun:\n\tpython3 main.py`}
    ]
}
