#!/usr/bin/env node

import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import { parse, Clipping } from '@nota/core-parser';
program
    .name('klipper')
    .description('CLI tool for making sense of your Kindle highlights and notes')
    .version('1.0.0');

program
    .command('parse <filePath>')
    .description('Parse a Kindle clippings file')
    .action((filePath: string) => {
        try {
            const fullPath = path.resolve(filePath);
            const rawTxtFile = fs.readFileSync(fullPath, 'utf-8');
            const clippings = parse(rawTxtFile);

            console.log(`✅ Successfully parsed ${clippings.length} clippings.`);

            clippings.forEach((clipping: Clipping, index: number) => {
                console.log(`\n--- Clipping ${index + 1} ---`);
                console.log(`Book: ${clipping.bookTitle} by ${clipping.authors.join(', ')}`);
                console.log(`Type: ${clipping.type}`);
                console.log(`Location: ${clipping.location}`);
                console.log(`Date Added: ${clipping.dateAdded ? clipping.dateAdded.toISOString() : 'Unknown'}`);
                console.log(`Text: "${clipping.text.substring(0, 100)}...."`);
            })
        } catch (error) {
            console.error('❌ Error parsing clippings file:', error);
        }

    });
program.parse(process.argv);
