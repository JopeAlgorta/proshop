FROM python:3.7-alpine
LABEL maintainer="Jope Algorta"

ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /requirements.txt
RUN apk add --update --no-cache postgresql-client jpeg-dev
RUN apk add --update --no-cache --virtual .tmp-build-deps \
    gcc libc-dev linux-headers postgresql-dev musl-dev zlib zlib-dev
RUN pip install -r /requirements.txt
RUN apk del .tmp-build-deps

# Copy the start_app scripts
COPY ./start_app_dev.sh /
RUN chmod +x /*.sh
CMD ["/start_app_dev.sh"]

RUN mkdir /app
WORKDIR /app
COPY ../backend /app

RUN mkdir -p /vol/web/media
RUN mkdir -p /vol/web/static
RUN adduser -D user
RUN chown -R user:user /vol/
RUN chmod -R 755 /vol/web
USER user
