FROM ruby:3.4-slim

WORKDIR /app

RUN apt-get update -qq && apt-get install -y --no-install-recommends build-essential libsqlite3-dev && rm -rf /var/lib/apt/lists/*

COPY Gemfile .
RUN bundle install

COPY . .

EXPOSE 3000
CMD ["bundle", "exec", "rackup", "-o", "0.0.0.0", "-p", "3000", "config.ru"]
