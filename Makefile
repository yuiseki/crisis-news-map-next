
all: river dispatch weather massmedia hatebu

river:
	npm run job:river

dispatch:
	npm run job:dispatch

weather:
	npm run job:weather

massmedia:
	npm run job:massmedia

hatebu:
	npm run job:hatebu
