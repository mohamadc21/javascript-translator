const translateFromHeader = document.getElementById('from');
const translateToHeader = document.getElementById('to');
const translateFromBtns = translateFromHeader.querySelectorAll('button[data-name]');
const translateToBtns = translateToHeader.querySelectorAll('button[data-name]');
const userInput = document.getElementById('user_input');
const outputInput = document.getElementById('output');
const lengthText = document.getElementById('length_text');
const translateBtn = document.getElementById('translate_btn');
const copyEls = document.querySelectorAll('.copy');


copyEls.forEach(copyEl => {
  copyEl.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'text';
    if(copyEl.classList.contains('input-copy')) {
      input.value = copyEl.parentElement.parentElement.parentElement.querySelector('textarea').value;
    }
    else {
      input.value = copyEl.parentElement.previousElementSibling.innerHTML;
    }
    input.select();
    navigator.clipboard.writeText(input.value);
    alert('copied to clipboard')
  })
})

translateFromBtns.forEach(changeLanguages);
translateToBtns.forEach(changeLanguages);

function changeLanguages(btn) {
  btn.addEventListener('click', () => {
    if(!btn.classList.contains('active')) {
      if(btn.parentElement.classList.contains('absolute')) {
        const btnParent = btn.parentElement.parentElement.parentElement;
        btnParent.querySelector('.active').classList.remove('active', 'bg-[#4D5562]');
        const btnName = btn.innerHTML;
        const btnDataname = btn.dataset.name;
        const primary2btn = btn.parentElement.parentElement.parentElement.querySelectorAll('button')[1];
        const selectboxBtn = btn.parentElement.parentElement.querySelector('button');
        btn.innerHTML = primary2btn.innerHTML;
        btn.dataset.name = primary2btn.dataset.name;
        selectboxBtn.querySelector('span').innerHTML = btn.innerHTML;
        primary2btn.innerHTML = btnName;
        primary2btn.dataset.name = btnDataname;
        primary2btn.classList.add('active', 'bg-[#4D5562]');

        if(btnParent.id == 'from') {
          const fromBtn = btnParent.querySelector('.active');
          const primaryOutputBtn = translateToHeader.querySelector('button');
          const outputFromBtn = translateToHeader.querySelector(`button[data-name='${fromBtn.dataset.name}']`);
          outputFromBtn.innerHTML = primaryOutputBtn.innerHTML;
          outputFromBtn.dataset.name = primaryOutputBtn.dataset.name;
          primaryOutputBtn.innerHTML = fromBtn.innerHTML;
          primaryOutputBtn.dataset.name = fromBtn.dataset.name;
        }
      }
      else {
        const btnParent = btn.parentElement;
        btnParent.querySelector('.active').classList.remove('active', 'bg-[#4D5562]');
        btn.classList.add('active', 'bg-[#4D5562]');
        
        if(btnParent.id = 'from') {
          const fromBtn = btnParent.querySelector('.active');
          const primaryOutputBtn = translateToHeader.querySelector('button');
          const outputFromBtn = translateToHeader.querySelector(`button[data-name='${fromBtn.dataset.name}']`);
          outputFromBtn.innerHTML = primaryOutputBtn.innerHTML;
          outputFromBtn.dataset.name = primaryOutputBtn.dataset.name;
          primaryOutputBtn.innerHTML = fromBtn.innerHTML;
          primaryOutputBtn.dataset.name = fromBtn.dataset.name;
        }
      }
    }
  })
}


lengthText.innerHTML = userInput.value.length + '/500';
userInput.addEventListener('input', () => {
  userInput.value.trim().length < 1 ? translateBtn.setAttribute('disabled', 'true') : translateBtn.removeAttribute('disabled');
  lengthText.innerHTML = userInput.value.length + '/500';
});

translateBtn.addEventListener('click', async () => {

  if(!userInput.value) return;

  const text = userInput.value;
  const from = translateFromHeader.querySelector('.active').dataset.name;
  const to = translateToHeader.querySelector('.active').dataset.name;

  if(!(from && to)) return;

  const translatedText = await translate(text, from, to);

  outputInput.innerHTML = translatedText;

});

async function translate(text, from, to) {
  outputInput.innerHTML = `
  <div class="w-12 h-12 bg-[url('spinner.svg')] bg-cover mt-[-20px] ml-[-10px]"></div>`;

  const API_URL = `https://api.mymemory.translated.net/get?q=${text}&langpair=${from}|${to}`
  const resp = await fetch(API_URL);
  const data = await resp.json();
  const { translatedText } = data.responseData;
  return translatedText;
}


async function renderDefaultTranslation() {
  const defaultText = 'Hello, how are you?';
  const translatedText = await translate(defaultText, 'english', 'french');
  
  userInput.value = defaultText;
  outputInput.innerHTML = translatedText;
  translateBtn.removeAttribute('disabled');
}

renderDefaultTranslation();

window.addEventListener('resize', (e) => {
  console.log(e);
});