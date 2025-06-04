import * as path from "path";
import * as fs from "fs/promises";
import {minify} from "terser";

const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";

const [inputDir = "src/lib/polygons/base", outputDir = "src/lib/polygons/mini"] = process.argv.slice(2);

function formatBytes(bytes: number): string {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    let num = bytes;
    while (num >= 1024 && i < units.length - 1) {
        num /= 1024;
        i++;
    }
    return `${num.toFixed(2)} ${units[i]}`;
}

async function minifyFiles() {
    try {
        await fs.mkdir(outputDir, {recursive: true});
        const files = await fs.readdir(inputDir);

        for (const file of files) {
            if (!file.endsWith(".ts")) continue;

            const inputPath = path.join(inputDir, file);
            const code = await fs.readFile(inputPath, "utf8");
            const originalSize = Buffer.byteLength(code, "utf8");

            const result = await minify(code, {
                compress: true,
                mangle: true,
                format: {comments: false},
            });

            if (result.code) {
                const minifiedSize = Buffer.byteLength(result.code, "utf8");
                const baseName = file.replace(/\.ts$/, "");
                const outputPath = path.join(outputDir, `${baseName}.min.ts`);

                await fs.writeFile(outputPath, result.code, "utf8");

                const diff = minifiedSize - originalSize;
                let diffColored;
                if (diff < 0) {
                    diffColored = `${GREEN}-${formatBytes(-diff)} smaller${RESET}`;
                } else if (diff > 0) {
                    diffColored = `${RED}+${formatBytes(diff)} bigger${RESET}`;
                } else {
                    diffColored = `${YELLOW}no size change${RESET}`;
                }

                console.log(
                    `Minified: ${file} → ${outputPath} (${formatBytes(originalSize)} → ${formatBytes(minifiedSize)}, ${diffColored})`
                );
            } else {
                console.warn(`No output for file: ${file}`);
            }
        }
    } catch (err) {
        console.error("Error during minify:", err);
    }
}

minifyFiles();
