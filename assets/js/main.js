        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        function playRetroBeep(freq = 440, type = 'sine', duration = 0.1) {
            try {
                if (audioCtx.state === 'suspended') {
                    audioCtx.resume();
                }
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + duration);
            } catch (e) {
                console.log(e);
            }
        }

        const toastSound = document.getElementById('toastSound');
        function showToast(msg) {
            toastSound.textContent = msg;
            toastSound.classList.add('show');
            setTimeout(() => toastSound.classList.remove('show'), 2000);
        }

        // Sonido Cry original de Pokémon
        function playPokemonCry(pokemonId) {
            if (pokemonId === 'gia') {
                playRetroBeep(780, 'sine', 0.2);
                showToast("✨ ¡Entrenadora Gia! ✨");
                return;
            }
            const cryUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`;
            const audio = new Audio(cryUrl);
            audio.volume = 0.5;
            audio.play().then(() => {
                showToast("🔊 ¡Sonido Pokémon!");
            }).catch(err => {
                playRetroBeep(600, 'square', 0.2);
            });
        }

        // Generador de lluvia continua de pétalos de sakura
        function createSakuraPetals() {
            const container = document.getElementById('sakuraContainer');
            if (!container) return;
            const petalCount = 16;
            for (let i = 0; i < petalCount; i++) {
                const petal = document.createElement('div');
                petal.className = 'petal';
                const size = Math.random() * 8 + 8;
                petal.style.width = `${size}px`;
                petal.style.height = `${size * 1.3}px`;
                petal.style.left = `${Math.random() * 95}%`;
                petal.style.animationDuration = `${Math.random() * 4 + 4}s`;
                petal.style.animationDelay = `${Math.random() * 5}s`;
                container.appendChild(petal);
            }
        }
        createSakuraPetals();

        // Modal de Ficha Pokémon / Entrenadora
        const modal = document.getElementById('pkmnModal');
        const closeModalBtn = document.getElementById('closeModal');
        const modalImg = document.getElementById('modalImg');
        const modalName = document.getElementById('modalName');
        const modalTypes = document.getElementById('modalTypes');
        const barHp = document.getElementById('barHp');
        const barAtk = document.getElementById('barAtk');
        const barDef = document.getElementById('barDef');
        const barSpd = document.getElementById('barSpd');

        const POKEMON_ROSTER = [
            { id: 700, name: 'Sylveon', img: 'assets/images/silveon2.png', type: 'hada' },
            { id: 719, name: 'Diancie', img: 'assets/images/diance.png', type: 'roca / hada' },
            { id: 869, name: 'Alcremie', img: 'assets/images/alcremie.png', type: 'hada' },
            { id: 786, name: 'Tapu Lele', img: 'assets/images/tapulele.png', type: 'psíquico / hada' },
            { id: 238, name: 'Smoochum', img: 'assets/images/smoochum.png', type: 'hielo / psíquico' },
            { id: 585, name: 'Deerling', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/585.png', type: 'normal / planta' },
            { id: 666, name: 'Vivillon', img: 'assets/images/vivillon.png', type: 'bicho / volador' },
            { id: 222, name: 'Corsola', img: 'assets/images/corsola.png', type: 'agua / roca' },
            { id: 241, name: 'Miltank', img: 'assets/images/miltank.png', type: 'normal' },
            { id: 300, name: 'Skitty', img: 'assets/images/skitty.png', type: 'normal' },
            { id: 251, name: 'Celebi', img: 'assets/images/celebi.png', type: 'psíquico / planta' },
            { id: 133, name: 'Eevee', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png', type: 'normal' },
            { id: 777, name: 'Togedemaru', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/777.png', type: 'eléctrico / acero' },
            { id: 842, name: 'Appletun', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/842.png', type: 'planta / dragón' },
            { id: 184, name: 'Azumarill', img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/184.png', type: 'agua / hada' },
            { id: 'gia', name: 'Gia', img: 'assets/images/gia_pokemon.webp', isTrainer: true, type: 'entrenadora hada' }
        ];

        async function fetchAndShowPokemonData(idOrName) {
            playRetroBeep(520, 'triangle', 0.15);
            modalName.textContent = "CARGANDO...";
            modalTypes.innerHTML = '<div class="pokedex-loader"><div class="spinner-pokeball"></div></div>';
            
            barHp.style.width = '0%';
            barAtk.style.width = '0%';
            barDef.style.width = '0%';
            barSpd.style.width = '0%';

            // Caso especial: Entrenadora Gia
            if (String(idOrName) === 'gia') {
                modalImg.src = 'assets/images/gia_pokemon.webp';
                modalName.textContent = "ENTRENADORA GIA 🌸";
                modalTypes.innerHTML = '<span class="type-badge">ENTRENADORA</span><span class="type-badge">TIPO HADA</span>';
                modal.classList.add('active');
                playPokemonCry('gia');
                setTimeout(() => {
                    barHp.style.width = '100%';
                    barAtk.style.width = '95%';
                    barDef.style.width = '92%';
                    barSpd.style.width = '98%';
                }, 50);
                return;
            }

            const found = POKEMON_ROSTER.find(p => String(p.id) === String(idOrName) || p.name.toLowerCase() === String(idOrName).toLowerCase());
            modalImg.src = found ? found.img : `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${idOrName}.png`;
            modal.classList.add('active');

            const cryId = (found && found.cryId) ? found.cryId : idOrName;
            playPokemonCry(cryId);

            try {
                const apiId = (idOrName == 10136) ? 774 : idOrName;
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${apiId}`);
                const data = await response.json();

                modalName.textContent = `#${data.id} ${ data.id == 777 ? 'Manu' : data.name.toUpperCase() }`;

                modalTypes.innerHTML = data.types.map(t =>
                    `<span class="type-badge">${t.type.name}</span>`
                ).join('');

                const statsMap = {};
                data.stats.forEach(s => statsMap[s.stat.name] = s.base_stat);

                barHp.style.width = Math.min(100, (statsMap['hp'] || 50) / 1.5) + '%';
                barAtk.style.width = Math.min(100, (statsMap['attack'] || 50) / 1.5) + '%';
                barDef.style.width = Math.min(100, (statsMap['defense'] || 50) / 1.5) + '%';
                barSpd.style.width = Math.min(100, (statsMap['speed'] || 50) / 1.5) + '%';
            } catch (err) {
                modalName.textContent = found ? found.name.toUpperCase() : "POKÉMON GIA";
                modalTypes.innerHTML = `<span class="type-badge">HADA</span>`;
                barHp.style.width = '65%';
                barAtk.style.width = '55%';
                barDef.style.width = '60%';
                barSpd.style.width = '75%';
            }
        }

        // Click en cualquier hotspot de la ilustración
        document.querySelectorAll('.pkmn-hotspot').forEach(hotspot => {
            hotspot.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = hotspot.getAttribute('data-id');
                fetchAndShowPokemonData(id);
            });
        });

        closeModalBtn.addEventListener('click', () => {
            playRetroBeep(300, 'sine', 0.1);
            modal.classList.remove('active');
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Interacción de Controles y Botones
        document.getElementById('cameraGem').addEventListener('click', () => {
            playRetroBeep(880, 'sine', 0.2);
            showToast("✨ Pokédex Gia activada ✨");
        });

        document.getElementById('pixelHeartBay').addEventListener('click', () => {
            playRetroBeep(720, 'sine', 0.15);
            showToast("💖 ¡Corazón de Hada activado!");
        });

        document.getElementById('miniSensor').addEventListener('click', () => {
            playRetroBeep(600, 'sine', 0.1);
            showToast("🌸 El mundo es más lindo si es rosa");
        });

        document.getElementById('grooveHeartBtn').addEventListener('click', () => {
            playRetroBeep(800, 'sine', 0.1);
            showToast("♥ Amor Pokémon ♥");
        });

        // Botón A: Despliega ficha Pokémon aleatoria de los que acompañan a Gia
        document.getElementById('bigAButton').addEventListener('click', () => {
            playRetroBeep(650, 'square', 0.12);
            // Si estamos en secuencia konami (A antes de B), no mostrar pokemon
            if (window.konamiBuf && window.konamiBuf.length > 0 && konamiBuf[konamiBuf.length-1] !== 'b') {
                // solo registrar input para konami, no pokemon
            } else {
                const pkmnsOnly = POKEMON_ROSTER.filter(p => !p.isTrainer);
                const randomPkmn = pkmnsOnly[Math.floor(Math.random() * pkmnsOnly.length)];
                fetchAndShowPokemonData(randomPkmn.id);
            }
        });

        // D-Pad con sonidos
        document.querySelectorAll('.dpad-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const pitch = 300 + Math.random() * 250;
                playRetroBeep(pitch, 'square', 0.08);
            });
        });

        // CONFIGURACIÓN GOOGLE SHEETS
        const SPREADSHEET_ID = "1qfeUqLAH0SMd2VUY7UPNkmVXW8DDZOpBfDXBUjqbSSU";

        // Catálogo de Íconos SVG para redes sociales (Fieles al diseño original)
        const ICONS_MAP = {
            instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" ry="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" stroke="none"/></svg>`,
            tiktok: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.47V13a8.28 8.28 0 0 0 5.73 2.26v-3.71a4.84 4.84 0 0 1-3.77-1.46v-3.4z"/></svg>`,
            whatsapp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path d="M16 14.5c-.3.8-1.5 1.5-2.2 1.5-.6 0-1.4-.3-2.6-1.5-1.5-1.5-2.1-2.9-2.1-3.6 0-.8.7-1.9 1.5-2.2.3-.1.6 0 .8.4l.7 1.6c.1.3 0 .6-.2.8l-.5.5c.3.6.8 1.1 1.4 1.4l.5-.5c.2-.2.5-.3.8-.2l1.6.7c.4.2.5.5.4.8z" fill="currentColor" stroke="none"/></svg>`,
            youtube: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2c-.3-1.1-1.2-2-2.3-2.3C19.2 3.4 12 3.4 12 3.4s-7.2 0-9.2.5C1.7 4.2.8 5.1.5 6.2 0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1.1 1.2 2 2.3 2.3 2 .5 9.2.5 9.2.5s7.2 0 9.2-.5c1.1-.3 2-1.2 2.3-2.3.5-2 .5-5.8.5-5.8s0-3.8-.5-5.8z"/><polygon points="9.6,15.5 15.6,12 9.6,8.5" fill="#ffffff"/></svg>`,
            twitch: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.6 5.5h1.7v5h-1.7zm4.7 0H18v5h-1.7zM6 1L2 5v14h5v4l4-4h3.5L22 11.5V1zm14.5 9.8l-3 3h-3.5l-2.6 2.6v-2.6H7.4V2.8h13.1z"/></svg>`,
            bunny: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12.5c-3 0-5.3 2-5.3 4.5 0 2.5 2.3 4.5 5.3 4.5s5.3-2 5.3-4.5c0-2.5-2.3-4.5-5.3-4.5zm-3.4-1c.9-.2 1.8-.8 2.2-1.7.9-1.8.8-5-.8-8-.5-.8-1.5-1.3-2.3-1-1 .4-1.3 1.5-1.1 2.6.4 2.5.6 5.6 2 8.1zm6.8 0c1.4-2.5 1.6-5.6 2-8.1.2-1.1-.1-2.2-1.1-2.6-.8-.3-1.8.2-2.3 1-1.6 3-1.7 6.2-.8 8 .4.9 1.3 1.5 2.2 1.7z"/></svg>`,
            default: `<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10a10 10 0 0 0-10-10zm0 18a8 8 0 0 1-7.93-7h4.15a3.99 3.99 0 0 0 7.56 0h4.15a8 8 0 0 1-7.93 7zm0-10a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm7.93 1a8 8 0 0 0-7.93-7 8 8 0 0 0-7.93 7h4.15a3.99 3.99 0 0 1 7.56 0h4.15z"/></svg>`
        };

        // 6 Enlaces predeterminados exactos a la imagen de referencia
        const DEFAULT_LINKS = [
            { titulo: "Instagram", url: "https://www.instagram.com/giia_coronado2", icono: "instagram", activo: "SI" },
            { titulo: "TikTok", url: "https://www.tiktok.com/@gia_coronado", icono: "tiktok", activo: "SI" },
            { titulo: "WhatsApp", url: "https://whatsapp.com/channel/0029Vb97fnJ8V0tiitLqxH2X", icono: "whatsapp", activo: "SI" },
            { titulo: "YouTube", url: "javascript:void(0)", icono: "youtube", activo: "NO" },
            { titulo: "Twitch", url: "javascript:void(0)", icono: "twitch", activo: "NO" },
            { titulo: "Gia ♡", url: "javascript:void(0)", icono: "bunny", isGia: true, activo: "SI" }
        ];

        function formatDisplayTitle(raw) {
            if (!raw) return 'Link';
            const str = String(raw).trim();
            if (str.toUpperCase() === 'INSTAGRAM') return 'Instagram';
            if (str.toUpperCase() === 'TIKTOK') return 'TikTok';
            if (str.toUpperCase() === 'WHATSAPP') return 'WhatsApp';
            if (str.toUpperCase() === 'YOUTUBE') return 'YouTube';
            if (str.toUpperCase() === 'TWITCH') return 'Twitch';
            if (str.toUpperCase().includes('GIA')) return 'Gia ♡';
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        }

        function renderLinksContainer(linksArray) {
            const container = document.getElementById('linksContainer');
            if (!container) return;

            container.innerHTML = '';

            // Copia de los enlaces asegurando que Gia ♡ esté presente como 6to botón
            const items = [...linksArray];
            const hasGia = items.some(it => {
                const name = String(it.titulo || it.title || it.nombre || '').toLowerCase();
                return name.includes('gia') || it.isGia;
            });
            if (!hasGia) {
                items.push({ titulo: "Gia ♡", url: "javascript:void(0)", icono: "bunny", isGia: true, activo: "SI" });
            }

            items.forEach(item => {
                const rawTitle = (item.titulo || item.title || item.nombre || 'Link');
                const displayTitle = formatDisplayTitle(rawTitle);
                const rawUrl = (item.url || item.link || '').trim();
                const iconKey = String(item.icono || item.icon || '').trim().toLowerCase();
                const isGiaItem = item.isGia || displayTitle.toLowerCase().includes('gia');

                const rawActivo = String(item.activo || item.active || '').trim().toUpperCase();
                const hasValidUrl = rawUrl !== '' && rawUrl !== '#' && rawUrl !== 'javascript:void(0)';
                const isActiveExplicit = (rawActivo === 'SI' || rawActivo === 'TRUE' || rawActivo === '1');
                const isActive = isGiaItem ? true : (isActiveExplicit && hasValidUrl);

                const href = isGiaItem ? 'javascript:void(0)' : (isActive ? rawUrl : 'javascript:void(0)');
                const isExternal = !isGiaItem && isActive && href.startsWith('http');

                const matchedKey = isGiaItem ? 'bunny' : (
                    iconKey.includes('tiktok') ? 'tiktok' :
                    (iconKey.includes('insta') ? 'instagram' :
                    (iconKey.includes('whats') ? 'whatsapp' :
                    (iconKey.includes('youtu') ? 'youtube' :
                    (iconKey.includes('twitch') ? 'twitch' :
                    (iconKey.includes('bunn') ? 'bunny' : 'default')))))
                );
                const svgIcon = ICONS_MAP[matchedKey] || ICONS_MAP['default'];

                const linkElement = document.createElement('a');
                linkElement.className = 'sidebar-link-btn';
                linkElement.href = href;
                if (isExternal) {
                    linkElement.target = "_blank";
                    linkElement.rel = "noopener";
                }

                linkElement.innerHTML = `
                    <div class="link-icon-wrap">${svgIcon}</div>
                    <span class="link-label-text">${displayTitle}</span>
                    <span class="link-heart-icon">♡</span>
                `;

                linkElement.addEventListener('mouseenter', () => {
                    playRetroBeep(580, 'sine', 0.05);
                });

                if (isGiaItem) {
                    linkElement.addEventListener('click', (e) => {
                        e.preventDefault();
                        fetchAndShowPokemonData('gia');
                    });
                } else if (!isActive) {
                    linkElement.addEventListener('click', (e) => {
                        e.preventDefault();
                        playRetroBeep(450, 'sine', 0.1);
                        showToast(`🌸 ¡Próximamente en ${displayTitle}!`);
                    });
                }

                container.appendChild(linkElement);
            });
        }

        // Renderizado inmediato de enlaces por defecto
        renderLinksContainer(DEFAULT_LINKS);

        (function () {
            const seq = ["up","up","down","down","left","right","left","right","b","a"];
            let buf = [];
            window.konamiBuf = buf;
            let unlocked = false;
            const ct = "FwgTNkUlOgRDFgBUQUUSdyoGEzQMFjxFLhMLAQ==";
            const k = 'GiaWebSecret2026';
            function dec(s) {
                const raw = atob(s);
                const out = [];
                for (let i = 0; i < raw.length; i++) {
                    out.push(String.fromCharCode(raw.charCodeAt(i) ^ k.charCodeAt(i % k.length)));
                }
                return out.join('');
            }
            function openSecret() {
                const m = document.getElementById('secretModal');
                document.getElementById('secretMsg').textContent = dec(ct);
                m.classList.add('active');
                playRetroBeep(880, 'sine', 0.3);
            }
            function pushInput(val) {
                buf.push(val);
                if (buf.length > seq.length) buf.shift();
                if (buf.length === seq.length && buf.every((v, i) => v === seq[i])) {
                    openSecret();
                }
            }
            document.querySelectorAll('.dpad-btn').forEach(btn => {
                btn.addEventListener('click', () => pushInput(btn.dataset.dir));
            });
            document.getElementById('bigAButton').addEventListener('click', () => {
                playRetroBeep(650, 'square', 0.12);
                pushInput('a');
            });
            const bBtn = document.getElementById('bigBButton');
            if (bBtn) {
                bBtn.addEventListener('click', () => {
                    playRetroBeep(500, 'square', 0.12);
                    showToast('🅱️ Botón B');
                    pushInput('b');
                });
            }
            document.getElementById('closeSecretModal').addEventListener('click', () => {
                document.getElementById('secretModal').classList.remove('active');
            });
            document.getElementById('secretModal').addEventListener('click', (e) => {
                if (e.target.id === 'secretModal') {
                    document.getElementById('secretModal').classList.remove('active');
                }
            });
        })();

        // Panel secreto
        (function () {
            const seq = ["up","up","down","down","left","right","left","right","b","a"];
            let buf = [];
            window.konamiBuf = buf;
            let unlocked = false;
            const ct = "FwgTNkUlOgRDFgBUQUUSdyoGEzQMFjxFLhMLAQ==";
            const k = 'GiaWebSecret2026';
            function dec(s) {
                const raw = atob(s);
                const out = [];
                for (let i = 0; i < raw.length; i++) {
                    out.push(String.fromCharCode(raw.charCodeAt(i) ^ k.charCodeAt(i % k.length)));
                }
                return out.join('');
            }
            function openSecret() {
                const m = document.getElementById('secretModal');
                document.getElementById('secretMsg').textContent = dec(ct);
                m.classList.add('active');
                playRetroBeep(880, 'sine', 0.3);
            }
            function pushInput(val) {
                buf.push(val);
                if (buf.length > seq.length) buf.shift();
                if (buf.length === seq.length && buf.every((v, i) => v === seq[i])) {
                    openSecret();
                }
            }
            document.querySelectorAll('.dpad-btn').forEach(btn => {
                btn.addEventListener('click', () => pushInput(btn.dataset.dir));
            });
            document.getElementById('bigAButton').addEventListener('click', () => {
                playRetroBeep(650, 'square', 0.12);
                pushInput('a');
            });
            const bBtn = document.getElementById('bigBButton');
            if (bBtn) {
                bBtn.addEventListener('click', () => {
                    playRetroBeep(500, 'square', 0.12);
                    showToast('🅱️ Botón B');
                    pushInput('b');
                });
            }
            document.getElementById('closeSecretModal').addEventListener('click', () => {
                document.getElementById('secretModal').classList.remove('active');
            });
            document.getElementById('secretModal').addEventListener('click', (e) => {
                if (e.target.id === 'secretModal') {
                    document.getElementById('secretModal').classList.remove('active');
                }
            });
        })();

        async function cargarLinksDesdeGoogleSheets() {
            if (!SPREADSHEET_ID || SPREADSHEET_ID.trim() === "") {
                return;
            }

            try {
                const sheetUrl = `https://opensheet.elk.sh/${SPREADSHEET_ID.trim()}/Hoja1`;
                const response = await fetch(sheetUrl);
                const data = await response.json();

                if (Array.isArray(data) && data.length > 0) {
                    renderLinksContainer(data);
                }
            } catch (err) {
                console.warn("⚠️ Usando enlaces por defecto:", err);
            }
        }

        cargarLinksDesdeGoogleSheets();

        // Toggle Créditos
        const sideCredits = document.getElementById('sideCredits');
        document.getElementById('creditsToggle').addEventListener('click', () => {
            playRetroBeep(480, 'sine', 0.1);
            sideCredits.classList.toggle('collapsed');
        });
