const firebaseConfig = {
  apiKey: "AIzaSyAshJV9t1XkvmX1s9nWMXu0VXkJHYKzjLU",
  authDomain: "sanrajllp.firebaseapp.com",
  projectId: "sanrajllp",
  storageBucket: "sanrajllp.firebasestorage.app",
  messagingSenderId: "493927465948",
  appId: "1:493927465948:web:2697c06f475f6d7b3d4519",
  measurementId: "G-3EQ9R30K4S"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- AUTH LOGIC ---
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('loginSection').classList.add('hidden');
    document.getElementById('dashboardSection').classList.remove('hidden');
    loadData();
  } else {
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('dashboardSection').classList.add('hidden');
  }
});

document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPass').value;
  auth.signInWithEmailAndPassword(email, pass)
    .catch(error => {
      const errEl = document.getElementById('loginError');
      errEl.textContent = error.message;
      errEl.classList.remove('hidden');
    });
});

function logout() { auth.signOut(); }

// --- CRUD LOGIC ---
let selectedStatus = '';

function loadData() {
  db.collection('inquiries').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
    const tbody = document.getElementById('tableBody');
    document.getElementById('totalCount').innerText = snapshot.size;
    document.getElementById('loadingMsg').style.display = 'none';
    
    tbody.innerHTML = '';
    
    if (snapshot.empty) {
      tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-gray-400">No inquiries found.</td></tr>';
      return;
    }
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const date = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleDateString() : 'N/A';
      
      let badgeClass = 'badge-new';
      if (data.status === 'Contacted') badgeClass = 'badge-contacted';
      if (data.status === 'Closed') badgeClass = 'badge-closed';
      
      const row = `
                        <tr class="hover:bg-gray-50 transition group">
                            <td class="p-4 text-gray-500">${date}</td>
                            <td class="p-4 font-bold text-black">${data.firstName} ${data.lastName}
                                <div class="text-xs font-normal text-gray-400">${data.email}</div>
                            </td>
                            <td class="p-4">${data.product}</td>
                            <td class="p-4"><span class="badge ${badgeClass}">${data.status || 'New'}</span></td>
                            <td class="p-4 text-right space-x-2">
                                <button onclick="openView('${doc.id}', '${data.firstName} ${data.lastName}', '${data.email}', '${data.product}', '${data.message}')" class="text-gray-400 hover:text-black p-2"><i class="fa-regular fa-eye"></i></button>
                                <button onclick="openEdit('${doc.id}', '${data.firstName}', '${data.status}')" class="text-gray-400 hover:text-blue-600 p-2"><i class="fa-solid fa-pen"></i></button>
                                <button onclick="deleteItem('${doc.id}')" class="text-gray-400 hover:text-red-600 p-2"><i class="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                    `;
      tbody.innerHTML += row;
    });
  });
}

// --- MODAL FUNCTIONS ---
function openView(id, name, email, product, msg) {
  document.getElementById('viewName').textContent = name;
  document.getElementById('viewEmail').textContent = email;
  document.getElementById('viewProduct').textContent = product;
  document.getElementById('viewMessage').textContent = msg;
  document.getElementById('viewModal').classList.add('open');
}

function openEdit(id, name, currentStatus) {
  document.getElementById('editDocId').value = id;
  document.getElementById('editModalInfo').textContent = `Updating: ${name}`;
  selectStatus(currentStatus || 'New');
  document.getElementById('editModal').classList.add('open');
}

function closeEditModal() {
  document.getElementById('editModal').classList.remove('open');
}

function selectStatus(status) {
  selectedStatus = status;
  document.querySelectorAll('.status-btn').forEach(btn => {
    if (btn.getAttribute('data-val') === status) {
      btn.classList.add('bg-black', 'text-white', 'border-black');
      btn.classList.remove('hover:bg-gray-50');
    } else {
      btn.classList.remove('bg-black', 'text-white', 'border-black');
      btn.classList.add('hover:bg-gray-50');
    }
  });
}

function saveStatus() {
  const id = document.getElementById('editDocId').value;
  db.collection('inquiries').doc(id).update({ status: selectedStatus })
    .then(() => closeEditModal());
}

function deleteItem(id) {
  // Simple custom confirm implementation
  const confirmed = confirm("Are you sure you want to delete this record? This cannot be undone.");
  if (confirmed) {
    db.collection('inquiries').doc(id).delete();
  }
}




// CONTACT LOGIC






 const firebaseConfig = {
    apiKey: "AIzaSyAshJV9t1XkvmX1s9nWMXu0VXkJHYKzjLU",
    authDomain: "sanrajllp.firebaseapp.com",
    projectId: "sanrajllp",
    storageBucket: "sanrajllp.firebasestorage.app",
    messagingSenderId: "493927465948",
    appId: "1:493927465948:web:2697c06f475f6d7b3d4519",
    measurementId: "G-3EQ9R30K4S"
};
    
    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();

    // --- UI LOGIC ---
    
    // Loader
    window.addEventListener('load', () => {
        const loader = document.getElementById('loader');
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; initAnimations(); }, 500);
        }, 200);
    });

    // Custom Select Logic
    const customSelect = document.querySelector('.custom-select');
    const selectedValue = document.getElementById('selectedValue');
    const hiddenInput = document.getElementById('product_interest_input');
    const options = document.querySelectorAll('.option');

    customSelect.addEventListener('click', function() { this.classList.toggle('open'); });
    
    options.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            options.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            const value = this.getAttribute('data-value');
            selectedValue.textContent = value;
            selectedValue.classList.remove('text-gray-500');
            selectedValue.classList.add('text-black', 'font-bold');
            hiddenInput.value = value;
            customSelect.classList.remove('open');
        });
    });

    document.addEventListener('click', function(e) {
        if (!customSelect.contains(e.target)) customSelect.classList.remove('open');
    });

    // Modal Logic
    function closeModal() {
        document.getElementById('successModal').classList.remove('active');
    }

    // --- FORM SUBMISSION LOGIC ---
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic Validation
        const product = hiddenInput.value;
        if (!product) {
            alert('Please select a product interest.');
            return;
        }

        // Loading State
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
        submitBtn.disabled = true;

        // Data Object
        const formData = {
            firstName: document.getElementById('fname').value,
            lastName: document.getElementById('lname').value,
            email: document.getElementById('email').value,
            product: product,
            message: document.getElementById('message').value,
            status: 'New', // Default status for Admin
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Send to Firestore
        db.collection('inquiries').add(formData)
        .then(() => {
            document.getElementById('successModal').classList.add('active');
            form.reset();
            // Reset Select
            selectedValue.textContent = "Select Product";
            selectedValue.classList.remove('text-black', 'font-bold');
            selectedValue.classList.add('text-gray-500');
            hiddenInput.value = "";
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
            alert("Error sending message. Please try again.");
        })
        .finally(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        });
    });

    function initAnimations() {
        gsap.from(".gs-reveal", { y: 30, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out" });
    }
    
    // 3D Background (Simplified)
    const container = document.getElementById('canvas-container');
    if(container) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);
        const particles = new THREE.BufferGeometry();
        const count = 300;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 15;
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({ size: 0.02, color: 0x000000 });
        const mesh = new THREE.Points(particles, mat);
        scene.add(mesh);
        function animate() { requestAnimationFrame(animate); mesh.rotation.y += 0.001; renderer.render(scene, camera); }
        animate();
    }