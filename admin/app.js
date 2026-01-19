// ================================
// CONFIGURATION SUPABASE
// ================================
const supabaseUrl = 'https://fqujvrklipnufaidxqhb.supabase.co';
const supabaseKey = 'sb_secret_b_DagUO_3Xd6Te9_nz_9VA_rqhT2Ywb';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// ================================
// SECURITE ADMIN
// ================================
async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.user_metadata.role !== 'admin') {
        alert("Accès refusé : connectez-vous en admin");
        window.location.href = "login.html"; // redirige vers login
    }
}
checkAdmin();

// ================================
// DECONNEXION
// ================================
async function logout() {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
}

// ================================
// CHANGER D'ONGLET
// ================================
function showTab(tab) {
    document.getElementById('content').innerHTML = `<h2>${tab}</h2>`;
    if(tab === 'pages') loadPages();
    if(tab === 'sections') loadSections();
    if(tab === 'articles') loadArticles();
    if(tab === 'media') loadMedia();
    if(tab === 'settings') loadSettings();
}

// ================================
// PAGES
// ================================
async function loadPages() {
    const { data: pages } = await supabase.from('pages').select('*');
    const container = document.getElementById('content');
    container.innerHTML = '<h2>Pages</h2><div id="pages-list"></div><button onclick="addPageForm()">Ajouter une page</button>';
    const list = document.getElementById('pages-list');
    pages.forEach(page => {
        list.innerHTML += `
        <div>
            <span>${page.title} (${page.slug})</span>
            <button class="edit" onclick="editPage(${page.id})">Modifier</button>
            <button class="delete" onclick="deletePage(${page.id})">Supprimer</button>
        </div>`;
    });
}

function addPageForm() {
    const container = document.getElementById('content');
    container.innerHTML = `
        <h2>Ajouter une page</h2>
        <label>Titre</label><input type="text" id="new-title">
        <label>Slug</label><input type="text" id="new-slug">
        <button onclick="addPage()">Créer</button>
        <button onclick="showTab('pages')">Annuler</button>
    `;
}

async function addPage() {
    const title = document.getElementById('new-title').value;
    const slug = document.getElementById('new-slug').value;
    await supabase.from('pages').insert([{ title, slug }]);
    showTab('pages');
}

async function editPage(id) {
    const { data: page } = await supabase.from('pages').select('*').eq('id', id).single();
    const container = document.getElementById('content');
    container.innerHTML = `
        <h2>Modifier la page</h2>
        <label>Titre</label><input type="text" id="edit-title" value="${page.title}">
        <label>Slug</label><input type="text" id="edit-slug" value="${page.slug}">
        <button onclick="updatePage(${id})">Sauvegarder</button>
        <button onclick="showTab('pages')">Annuler</button>
    `;
}

async function updatePage(id) {
    const title = document.getElementById('edit-title').value;
    const slug = document.getElementById('edit-slug').value;
    await supabase.from('pages').update({ title, slug }).eq('id', id);
    showTab('pages');
}

async function deletePage(id) {
    if(confirm("Voulez-vous vraiment supprimer cette page ?")) {
        await supabase.from('pages').delete().eq('id', id);
        showTab('pages');
    }
}

// ================================
// SECTIONS
// ================================
async function loadSections() {
    const { data: sections } = await supabase.from('sections').select('*');
    const container = document.getElementById('content');
    container.innerHTML = '<h2>Sections</h2><div id="sections-list"></div><button onclick="addSectionForm()">Ajouter une section</button>';
    const list = document.getElementById('sections-list');
    sections.forEach(sec => {
        list.innerHTML += `
        <div>
            <span>${sec.page_slug} - ${sec.section_type} : ${sec.title}</span>
            <button class="edit" onclick="editSection(${sec.id})">Modifier</button>
            <button class="delete" onclick="deleteSection(${sec.id})">Supprimer</button>
        </div>`;
    });
}

function addSectionForm() {
    const container = document.getElementById('content');
    container.innerHTML = `
        <h2>Ajouter une section</h2>
        <label>Page Slug</label><input type="text" id="sec-page">
        <label>Type</label><input type="text" id="sec-type">
        <label>Titre</label><input type="text" id="sec-title">
        <label>Contenu</label><textarea id="sec-content"></textarea>
        <label>URL Média</label><input type="text" id="sec-media">
        <button onclick="addSection()">Créer</button>
        <button onclick="showTab('sections')">Annuler</button>
    `;
}

async function addSection() {
    const page_slug = document.getElementById('sec-page').value;
    const section_type = document.getElementById('sec-type').value;
    const title = document.getElementById('sec-title').value;
    const content = document.getElementById('sec-content').value;
    const media_url = document.getElementById('sec-media').value;
    await supabase.from('sections').insert([{ page_slug, section_type, title, content, media_url }]);
    showTab('sections');
}

async function editSection(id) {
    const { data: sec } = await supabase.from('sections').select('*').eq('id', id).single();
    const container = document.getElementById('content');
    container.innerHTML = `
        <h2>Modifier la section</h2>
        <label>Page Slug</label><input type="text" id="edit-page" value="${sec.page_slug}">
        <label>Type</label><input type="text" id="edit-type" value="${sec.section_type}">
        <label>Titre</label><input type="text" id="edit-title" value="${sec.title}">
        <label>Contenu</label><textarea id="edit-content">${sec.content}</textarea>
        <label>URL Média</label><input type="text" id="edit-media" value="${sec.media_url}">
        <button onclick="updateSection(${id})">Sauvegarder</button>
        <button onclick="showTab('sections')">Annuler</button>
    `;
}

async function updateSection(id) {
    const page_slug = document.getElementById('edit-page').value;
    const section_type = document.getElementById('edit-type').value;
    const title = document.getElementById('edit-title').value;
    const content = document.getElementById('edit-content').value;
    const media_url = document.getElementById('edit-media').value;
    await supabase.from('sections').update({ page_slug, section_type, title, content, media_url }).eq('id', id);
    showTab('sections');
}

async function deleteSection(id) {
    if(confirm("Voulez-vous vraiment supprimer cette section ?")) {
        await supabase.from('sections').delete().eq('id', id);
        showTab('sections');
    }
}

// ================================
// ARTICLES
// ================================
async function loadArticles() {
    const { data: articles } = await supabase.from('articles').select('*');
    const container = document.getElementById('content');
    container.innerHTML = '<h2>Articles</h2><div id="articles-list"></div><button onclick="addArticleForm()">Ajouter un article</button>';
    const list = document.getElementById('articles-list');
    articles.forEach(a => {
        list.innerHTML += `
        <div>
            <span>${a.title}</span>
            <button class="edit" onclick="editArticle(${a.id})">Modifier</button>
            <button class="delete" onclick="deleteArticle(${a.id})">Supprimer</button>
        </div>`;
    });
}

function addArticleForm() {
    const container = document.getElementById('content');
    container.innerHTML = `
        <h2>Ajouter un article</h2>
        <label>Titre</label><input type="text" id="art-title">
        <label>Slug</label><input type="text" id="art-slug">
        <label>Résumé</label><textarea id="art-excerpt"></textarea>
        <label>Contenu</label><textarea id="art-content"></textarea>
        <label>URL Image</label><input type="text" id="art-cover">
        <button onclick="addArticle()">Créer</button>
        <button onclick="showTab('articles')">Annuler</button>
    `;
}

async function addArticle() {
    const title = document.getElementById('art-title').value;
    const slug = document.getElementById('art-slug').value;
    const excerpt = document.getElementById('art-excerpt').value;
    const content = document.getElementById('art-content').value;
    const cover_image = document.getElementById('art-cover').value;
    await supabase.from('articles').insert([{ title, slug, excerpt, content, cover_image }]);
    showTab('articles');
}

async function editArticle(id) {
    const { data: art } = await supabase.from('articles').select('*').eq('id', id).single();
    const container = document.getElementById('content');
    container.innerHTML = `
        <h2>Modifier l'article</h2>
        <label>Titre</label><input type="text" id="edit-title" value="${art.title}">
        <label>Slug</label><input type="text" id="edit-slug" value="${art.slug}">
        <label>Résumé</label><textarea id="edit-excerpt">${art.excerpt}</textarea>
        <label>Contenu</label><textarea id="edit-content">${art.content}</textarea>
        <label>URL Image</label><input type="text" id="edit-cover" value="${art.cover_image}">
        <button onclick="updateArticle(${id})">Sauvegarder</button>
        <button onclick="showTab('articles')">Annuler</button>
    `;
}

async function updateArticle(id) {
    const title = document.getElementById('edit-title').value;
    const slug = document.getElementById('edit-slug').value;
    const excerpt = document.getElementById('edit-excerpt').value;
    const content = document.getElementById('edit-content').value;
    const cover_image = document.getElementById('edit-cover').value;
    await supabase.from('articles').update({ title, slug, excerpt, content, cover_image }).eq('id', id);
    showTab('articles');
}

async function deleteArticle(id) {
    if(confirm("Voulez-vous vraiment supprimer cet article ?")) {
        await supabase.from('articles').delete().eq('id', id);
        showTab('articles');
    }
}

// ================================
// MEDIA
// ================================
async function loadMedia() {
    const { data: media } = await supabase.from('media').select('*');
    const container = document.getElementById('content');
    container.innerHTML = '<h2>Médias</h2><div id="media-list"></div><button onclick="addMediaForm()">Ajouter un média</button>';
    const list = document.getElementById('media-list');
    media.forEach(m => {
        list.innerHTML += `
        <div>
            <span>${m.type} : ${m.url}</span>
            <button class="delete" onclick="deleteMedia(${m.id})">Supprimer</button>
        </div>`;
    });
}

function addMediaForm() {
    const container = document.getElementById('content');
    container.innerHTML = `
        <h2>Ajouter un média</h2>
        <label>Type</label><input type="text" id="media-type">
        <label>URL</label><input type="text" id="media-url">
        <label>Texte alternatif</label><input type="text" id="media-alt">
        <button onclick="addMedia()">Ajouter</button>
        <button onclick="showTab('media')">Annuler</button>
    `;
}

async function addMedia() {
    const type = document.getElementById('media-type').value;
    const url = document.getElementById('media-url').value;
    const alt_text = document.getElementById('media-alt').value;
    await supabase.from('media').insert([{ type, url, alt_text }]);
    showTab('media');
}

async function deleteMedia(id) {
    if(confirm("Voulez-vous vraiment supprimer ce média ?")) {
        await supabase.from('media').delete().eq('id', id);
        showTab('media');
    }
}

// ================================
// SETTINGS
// ================================
async function loadSettings() {
    const { data: settings } = await supabase.from('site_settings').select('*');
    const container = document.getElementById('content');
    container.innerHTML = '<h2>Réglages</h2><div id="settings-list"></div>';
    const list = document.getElementById('settings-list');

    settings.forEach(s => {
        list.innerHTML += `
        <div>
            <label>${s.key}</label>
            <input type="text" id="setting-${s.key}" value="${s.value}">
            <button onclick="updateSetting('${s.key}')">Sauvegarder</button>
        </div>`;
    });
}

async function updateSetting(key) {
    const value = document.getElementById(`setting-${key}`).value;
    await supabase.from('site_settings').update({ value }).eq('key', key);
    alert(`Réglage ${key} mis à jour !`);
}
