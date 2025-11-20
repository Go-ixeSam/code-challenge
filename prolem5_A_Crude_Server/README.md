Things you must have to run this project:

1. Create your own .env file to open a connet to database ( Postgresql ), you can read env.example to create a correct .env file.
2. You must have Node.js 20+ ( Obviously )
3. You must have Docker Engine ( for linux user), or Docker Desktop ( for Window user)
4. A database tool for reading a dump-data which is prepared in this project. That right, you dont have to install Postgresql, just need a docker. Or if you dont care a data interface, and you can check it by calling API, okay, let do that.

The reason I chose it is because it provides me with a basic clean architecture. The nature of this framework is based on module management.
With a module is a class marked with a decorator **@Module()**, which is responsible for grouping related logic together.
Including:
With a **Controller** used to route requests to the corresponding service
With a **Service** used to handle business logic
With an **Entity** used to map with the database
With a **Repository** used to query the DB. (applying the **repository pattern**).

With the database used in this project, I used an online database and dumped it for you. This database has only one schema and a table named netflix_shows. includes fields 
- show_id TEXT PRIMARY KEY
- type TEXT
- title TEXT
- director TEXT
- cast_members TEXT
- country TEXT
- date_added DATE
- release_year INTEGER
- rating TEXT
- duration TEXT
- listed_in TEXT
- description TEXT

