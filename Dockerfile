FROM ruby:3.4-slim

WORKDIR /app

RUN apt-get update -qq \
  && apt-get install --no-install-recommends -y build-essential libyaml-dev \
  && rm -rf /var/lib/apt/lists/*

COPY Gemfile ./
RUN bundle install --jobs 1 --retry 3

COPY . .

ENV RAILS_ENV=production \
    RAILS_LOG_TO_STDOUT=true \
    RAILS_SERVE_STATIC_FILES=true

EXPOSE 4173
CMD ["bin/rails", "server", "-b", "0.0.0.0", "-p", "4173"]
