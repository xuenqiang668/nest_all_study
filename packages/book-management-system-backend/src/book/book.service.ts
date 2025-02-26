import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AddBookDto } from './dto/add-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { DbService } from 'src/db/db.service';
import { Book } from './entities/book.entity';
import { randomInt } from 'crypto';


function randomId() {
    return Math.floor(Math.random() * 1000000);
}

@Injectable()
export class BookService {


    @Inject(DbService)
    private dbService: DbService

    async list() {
        const books: Book[] = await this.dbService.read()
        return books
    }

    async findById(id: number) {
        const books: Book[] = await this.dbService.read()

        const foundBook = books.find(f => f.id == id)

        if (!foundBook) {
            throw new BadRequestException("the id is not found")
        }



        return foundBook


    }

    async add(addBookDto: AddBookDto) {

        const books: Book[] = await this.dbService.read()

        const book = new Book()
        book.id = randomId()
        book.author = addBookDto.author
        book.cover = addBookDto.cover
        book.description = addBookDto.description
        book.name = addBookDto.name

        books.push(book)

        await this.dbService.write(books)

        return book
    }

    async update(updateBookDto: UpdateBookDto) {
        const books: Book[] = await this.dbService.read()
        const foundBook = books.find(f => f.id = updateBookDto.id)

        if (!foundBook) {
            throw new BadRequestException('该图书不存在')
        }

        Object.assign(foundBook, updateBookDto)

        await this.dbService.write(books)

        return foundBook

    }

    async deleteById(id: number) {
        const books: Book[] = await this.dbService.read();
        const index = books.findIndex(book => book.id === id);
        console.log('id', id);
        console.log('index', index);

        if (index !== -1) {
            books.splice(index, 1);
            await this.dbService.write(books);

            return 'delete ok'
        }
        throw new BadRequestException('id is not in Books')

    }
}
