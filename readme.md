#### What ?

Token streaming daap, smart contracts written in new version of Cairo i.e cairo 1. Also includes the frontend interface for the same.

#### Local Setup

- Install Scarb [Scarb Install](https://docs.swmansion.com/scarb/download)
- Clone the repo
- `cd client` and `npm install`
- `cd cairostream` and `scarb build`
- scarb build should generate a target folder(ignored by git)
- For client
  - change the .env.example to .env
  - replace the .env variable with your `API KEY`
  - Navigate to `/src/lib/utils` and replace the deployed address with yours
  - `npm run dev`
