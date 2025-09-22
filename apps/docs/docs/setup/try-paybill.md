---
id: try-paybill
title: Try Paybill
---

# Try Paybill

## On local with Docker

You can run the command below to have Paybill up and running right away.

```bash
docker run \
  --name paybill \
  --restart unless-stopped \
  -p 80:80 \
  --platform linux/amd64 \
  -v paybill_data:/var/lib/postgresql/13/main \
  -v temporal_sqlite:/etc/temporal \
  paybilldev/try:ee-latest
```

#### Setup information

- Runs the Paybill server on the port 80 on your machine.
- Container has postgres already configured within. All the data will be available in the docker volume `paybill_data`.
- You can make use of `--env` or `--env-file` flag to test against various env configurables mentioned [here](/docs/setup/env-vars).
- Use `docker stop paybill` to stop the container and `docker start paybill` to start the container thereafter.

#### Dynamic Port Setup

To run the Paybill server on a different port, such as 8080 or any other port of your choice, use the following command:

```sh
docker run \
  --name paybill \
  --restart unless-stopped \
  -p 8080:8080 \
  -e PORT=8080 \
  --platform linux/amd64 \
  -v paybill_data:/var/lib/postgresql/13/main \
  -v temporal_sqlite:/etc/temporal \
  paybilldev/try:ee-latest
```

- This command will start the Paybill server on port 8080.
- The `-e PORT=8080` flag sets the `PORT` environment variable to 8080, allowing the Paybill server to listen on port 8080.

By following these instructions, you can easily run the Paybill server on the port of your choice, ensuring flexibility in your setup.

_If you have any questions feel free to join our [Discord Community](https://discord.gg/v9rYchap) or send us an email at info@paybill.dev._