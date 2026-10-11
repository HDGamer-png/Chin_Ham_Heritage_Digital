import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import sql from 'mssql';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
let sqlConnected = false;

const readJson = (fileName) => {
    const fullPath = path.join(DATA_DIR, fileName);
    const raw = fs.readFileSync(fullPath, 'utf-8');
    return JSON.parse(raw);
};

const getDbConfig = () => {
    const server = process.env.SQL_SERVER;
    const database = process.env.SQL_DATABASE;
    const user = process.env.SQL_USER;
    const password = process.env.SQL_PASSWORD;

    if (!server || !database || !user || !password) {
        return null;
    }

    return {
        server,
        database,
        user,
        password,
        port: Number(process.env.SQL_PORT || 1433),
        options: {
            encrypt: process.env.SQL_ENCRYPT === 'true',
            trustServerCertificate: process.env.SQL_TRUST_SERVER_CERTIFICATE === 'true',
            enableArithAbort: true,
        },
    };
};

const ensureSqlConnection = async() => {
    const config = getDbConfig();
    if (!config) {
        sqlConnected = false;
        return false;
    }

    try {
        await sql.connect(config);
        sqlConnected = true;
        console.log('Connected to SQL Server successfully');
        return true;
    } catch (error) {
        sqlConnected = false;
        console.warn('SQL Server unavailable, using local JSON fallback.');
        console.warn(error.message);
        return false;
    }
};

const normalizeSqlRow = (row, prefix = '') => {
    const output = {};

    for (const [key, value] of Object.entries(row)) {
        const normalizedKey = key.replace(prefix, '').replace(/^[A-Z]/, (char) => char.toLowerCase());
        output[normalizedKey] = value;
    }

    return output;
};

const listSites = async() => {
    if (sqlConnected) {
        const result = await sql.query `SELECT SiteId, Slug, Name, Subtitle, Description, Summary, Category, Status, SortOrder, CreatedAt, UpdatedAt FROM dbo.Sites ORDER BY SortOrder, Name`;
        return result.recordset.map((item) => ({
            id: item.SiteId,
            slug: item.Slug,
            name: item.Name,
            subtitle: item.Subtitle,
            description: item.Description,
            summary: item.Summary,
            category: item.Category,
            status: item.Status,
            sortOrder: item.SortOrder,
            createdAt: item.CreatedAt,
            updatedAt: item.UpdatedAt,
        }));
    }

    return readJson('sites.json');
};

const listDocuments = async() => {
    if (sqlConnected) {
        const result = await sql.query `SELECT DocumentId, SiteId, Title, FileName, FileType, MimeType, Category, Description, FileUrl, IsFeatured, Status, PublishedAt, CreatedAt, UpdatedAt FROM dbo.Documents ORDER BY PublishedAt DESC`;
        return result.recordset.map((item) => ({
            id: item.DocumentId,
            siteId: item.SiteId,
            title: item.Title,
            fileName: item.FileName,
            fileType: item.FileType,
            mimeType: item.MimeType,
            category: item.Category,
            description: item.Description,
            url: item.FileUrl,
            isFeatured: item.IsFeatured,
            status: item.Status,
            publishedAt: item.PublishedAt,
            createdAt: item.CreatedAt,
            updatedAt: item.UpdatedAt,
        }));
    }

    return readJson('documents.json');
};

const listAudio = async() => {
    if (sqlConnected) {
        const result = await sql.query `SELECT AudioId, SiteId, Title, FileName, FileUrl, DurationSeconds, Category, Description, Language, IsFeatured, Status, CreatedAt, UpdatedAt FROM dbo.AudioTracks ORDER BY Title`;
        return result.recordset.map((item) => ({
            id: item.AudioId,
            siteId: item.SiteId,
            title: item.Title,
            fileName: item.FileName,
            fileUrl: item.FileUrl,
            duration: item.DurationSeconds ? `${String(Math.floor(item.DurationSeconds / 60)).padStart(2, '0')}:${String(item.DurationSeconds % 60).padStart(2, '0')}` : null,
            category: item.Category,
            description: item.Description,
            language: item.Language,
            isFeatured: item.IsFeatured,
            status: item.Status,
            createdAt: item.CreatedAt,
            updatedAt: item.UpdatedAt,
        }));
    }

    return readJson('audio.json');
};

const listMedia = async() => {
    if (sqlConnected) {
        const result = await sql.query `SELECT MediaId, SiteId, Title, AssetType, FileName, FileUrl, MimeType, AltText, Width, Height, IsCover, SortOrder, Status, CreatedAt, UpdatedAt FROM dbo.MediaAssets ORDER BY SortOrder`;
        return result.recordset.map((item) => ({
            id: item.MediaId,
            siteId: item.SiteId,
            title: item.Title,
            assetType: item.AssetType,
            fileName: item.FileName,
            fileUrl: item.FileUrl,
            mimeType: item.MimeType,
            altText: item.AltText,
            width: item.Width,
            height: item.Height,
            isCover: item.IsCover,
            sortOrder: item.SortOrder,
            status: item.Status,
            createdAt: item.CreatedAt,
            updatedAt: item.UpdatedAt,
        }));
    }

    return readJson('media.json');
};

const listContacts = async() => {
    return readJson('contacts.json');
};

app.get('/api/health', async(req, res) => {
    const connected = sqlConnected || (await ensureSqlConnection());

    res.json({
        status: 'ok',
        message: 'Chín Hầm Backend is running',
        dataSource: connected ? 'sql-server' : 'local-json',
    });
});

app.get('/api/sites', async(req, res) => {
    const sites = await listSites();
    res.json(sites);
});

app.get('/api/sites/:slug', async(req, res) => {
    const sites = await listSites();
    const site = sites.find((item) => item.slug === req.params.slug || item.Slug === req.params.slug || item.id === req.params.slug);

    if (!site) {
        return res.status(404).json({ message: 'Site not found' });
    }

    return res.json(site);
});

app.get('/api/documents', async(req, res) => {
    const documents = await listDocuments();
    res.json(documents);
});

app.get('/api/audio', async(req, res) => {
    const audio = await listAudio();
    res.json(audio);
});

app.get('/api/media', async(req, res) => {
    const media = await listMedia();
    res.json(media);
});

app.get('/api/contact', async(req, res) => {
    const contacts = await listContacts();
    res.json(contacts);
});

app.post('/api/contact', (req, res) => {
    const filePath = path.join(DATA_DIR, 'contacts.json');
    const contacts = readJson('contacts.json');

    const newEntry = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        ...req.body,
    };

    contacts.unshift(newEntry);
    fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2));

    res.status(201).json({ success: true, data: newEntry });
});

const startServer = async() => {
    await ensureSqlConnection();

    app.listen(PORT, () => {
        console.log(`Backend running at http://localhost:${PORT}`);
        console.log(`Data source: ${sqlConnected ? 'SQL Server' : 'Local JSON'}`);
    });
};

startServer();