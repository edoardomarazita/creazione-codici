const board = document.getElementById('board');
const flowDiv = document.getElementById('flow');
const colors = ['#ffadad','#ffd6a5','#fdffb6','#caffbf','#9bf6ff','#a0c4ff','#bdb2ff','#ffc6ff'];
let colorIndex = 0;
let currentZ = 1;

function createNote() {
  const note = document.createElement('div');
  note.className = 'post-it';
  note.style.background = colors[colorIndex % colors.length];
  colorIndex++;
  note.style.left = '20px';
  note.style.top = '20px';
  note.style.zIndex = currentZ++;

  const content = document.createElement('div');
  content.className = 'content';
  content.contentEditable = true;
  content.setAttribute('placeholder', 'Scrivi qui...');
  note.appendChild(content);

  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  note.appendChild(dateInput);

  makeDraggable(note);
  board.appendChild(note);
}

function makeDraggable(elmnt) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    elmnt.style.zIndex = currentZ++;
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function createFlow() {
  const notes = Array.from(document.querySelectorAll('.post-it')).map(note => {
    const text = note.querySelector('.content').innerText.trim();
    const date = note.querySelector('input[type="date"]').value;
    return {text, date};
  }).filter(n => n.text !== '' || n.date !== '');

  notes.sort((a,b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date);
  });

  const list = document.createElement('ol');
  notes.forEach(n => {
    const li = document.createElement('li');
    li.textContent = n.text + (n.date ? ' - ' + n.date : '');
    list.appendChild(li);
  });

  flowDiv.innerHTML = '';
  flowDiv.appendChild(list);
  flowDiv.classList.remove('hidden');
}

function exportFlow() {
  if (flowDiv.classList.contains('hidden')) return;
  const opt = {
    margin:       1,
    filename:     'flusso_attivita.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().from(flowDiv).set(opt).save();
}

// Event listeners
 document.getElementById('new-note').addEventListener('click', createNote);
 document.getElementById('create-flow').addEventListener('click', createFlow);
 document.getElementById('export-flow').addEventListener('click', exportFlow);
