## Installation

First configure your app by copying the `.env.example` file to `.env` and substitute the values
for your development environment.

```
yarn
yarn dev
```

The client is running on http://localhost:2000

## Login

```
email: chao@torii.co
pw: abc123
```

## :blue_book: Style-guide

Make sure to follow [our style guide](https://creative-earth-33e.notion.site/TT-Style-guide-f6374a916a7d41739e45473111cb1882)

## Development Process

1. From a Jira ticket (feature request or bug), create a new branch
   from `development`, using this format `<id_project>-<id_feature>-simple-description-in-kebab-case`
2. When code is ready for review, create a new PR and follow the template.
3. Add front-end devs as reviewer.
4. Move Jira ticket to `In Review`.
5. Make any requested changes in the same branch.
6. Once its been approved merge it with `development`.
7. Move Jira tix to `QA`.
