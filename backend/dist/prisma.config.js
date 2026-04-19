"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config_1 = require("prisma/config");
exports.default = (0, config_1.defineConfig)({
    schema: './prisma/schema.prisma',
    datasource: {
        url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
    },
    migrations: {
        seed: 'npx tsx prisma/seed.ts',
    },
});
//# sourceMappingURL=prisma.config.js.map