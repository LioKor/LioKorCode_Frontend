## LioKor Code

System for teaching developers

#### How to build:
1. `yarn`
2. `yarn dist`

#### Development:
1. `yarn`
2. `yarn dev`

*OR*

1. `docker run -d -t -p 9000:9000 --mount type=bind,source="$(pwd)"/,target=/app node`
2. Open Docker CLI
3. `cd app && yarn && yarn dev`
