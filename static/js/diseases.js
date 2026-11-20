
document.addEventListener('DOMContentLoaded', () => {
  // your code here



  function getDiseaseImageUrl(diseaseKey, imageName) {
    return `/static/images/diseases_images/${diseaseKey}/${imageName}`;
  }

  const diseaseContainer = document.getElementById('diseaseContainer');
  const diseaseLoadingMessage = document.getElementById('diseaseLoadingMessage');
  if (diseaseLoadingMessage) {
    diseaseLoadingMessage.style.display = 'block'; // Show loading message initially
  }
  if (diseaseContainer) {
    const diseasesFile = '/static/data/diseases.json';
    const diseaseImagesFile = '/static//data/disease_images.json';
  
    Promise.all([
      fetch(diseasesFile).then(res => res.json()),
      fetch(diseaseImagesFile).then(res => res.json())
    ])
      .then(([diseaseData, imageList]) => {
        if (diseaseLoadingMessage) {
          diseaseLoadingMessage.style.display = 'none'; // Hide loading message on success
        }
        diseaseContainer.innerHTML = '';
  
        diseaseData.forEach(disease => {
          const diseaseCard = document.createElement('div');
          diseaseCard.classList.add('disease-card');
  
          const diseaseKey = disease.disease_name.replace(/ /g, '_');
  
          const cardLink = document.createElement('a');
          cardLink.href = `/disease/${diseaseKey}`;
          cardLink.style.textDecoration = 'none';
          cardLink.style.color = 'inherit';
  
          const img = document.createElement('img');
          const images = imageList[diseaseKey];
          img.src = images && images.length > 0
            ? getDiseaseImageUrl(diseaseKey, images[0])
            : '/static/images/default.jpg';
          
          img.alt = disease.disease_name;
  
          const h2 = document.createElement('h2');
          h2.textContent = disease.disease_name;
  
          cardLink.appendChild(img);
          cardLink.appendChild(h2);
          diseaseCard.appendChild(cardLink);
          diseaseContainer.appendChild(diseaseCard);
        });
      })
      .catch(error => {
        console.error('Error loading diseases:', error);
        if (diseaseLoadingMessage) {
            diseaseLoadingMessage.textContent = 'Failed to load diseases. Please try again later.';
            diseaseLoadingMessage.style.color = 'red';
        } else {
            diseaseContainer.innerHTML = '<p style="color:red; text-align:center;">Failed to load diseases. Please try again later.</p>';
        }
      });
  }
  






  const pathSegments = window.location.pathname.split('/');
      const diseaseKey = pathSegments[pathSegments.length - 1];
      const diseaseDetailContainer = document.getElementById('diseaseDetailContainer');

      fetch('/static/data/diseases.json')
          .then(response => response.json())
          .then(data => {
              const formattedKey = diseaseKey.replace(/_/g, ' ');
              const disease = data.find(d => d.disease_name === formattedKey);

              if (!disease) {
                  diseaseDetailContainer.innerHTML = '<p style="color:red;">Disease not found.</p>';
                  return;
              }

              const imagesHtml = (disease.images || []).map(src =>
                  `<img src="${getDiseaseImageUrl(diseaseKey, src)}" alt="${disease.disease_name}" class="detail-image">`
              ).join('');

              const listHtml = (label, items) => `
        <div class="detail-section-block">
          <h3>${label}</h3>
          <ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>
        </div>
      `;

              const plantHtml = disease.plants_used.map(p => `
        <div class="used-plant">
          <h4>${p.plant_name} <small>(${p.botanical_name})</small></h4>
          <p><strong>Usage:</strong> ${p.usage}</p>
          <p><strong>Chemical Constituents:</strong> ${p.chemical_constituents.join(', ')}</p>
          <p><strong>Medicinal Properties:</strong> ${p.medicinal_properties.join(', ')}</p>
        </div>
      `).join('');

            diseaseDetailContainer.innerHTML = `
              <h1 class="disease_heading">${disease.disease_name}</h1>
        <section class="detail-card">
          
          <p><strong>Category:</strong> ${disease.category}</p>
          <p>${disease.description}</p>
          ${imagesHtml ? `<div class="image-gallery">${imagesHtml}</div>` : ''}

          ${listHtml("Causes", disease.causes)}
          ${listHtml("Symptoms", disease.symptoms)}

          <div class="detail-section-block">
            <h3>Ayurvedic View</h3>
            <p>${disease.ayurvedic_view}</p>
          </div>

          ${listHtml("Preventive Measures", disease.preventive_measures)}

          <div class="detail-section-block">
            <h3>Plants Used</h3>
            ${plantHtml}
          </div>

          ${listHtml("Treatment Methods", disease.treatment_methods)}
          ${listHtml("Possible Side Effects", disease.possible_side_effects)}
        </section>
      `;
          })
          .catch(err => {
              console.error('Error loading disease details:', err);
              diseaseDetailContainer.innerHTML = '<p style="color:red;">Error loading details.</p>';
          });


});