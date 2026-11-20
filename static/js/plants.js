
document.addEventListener('DOMContentLoaded', () => {
    // your code here



    //plant data loading and display

    function getPlantImageUrl(plantKey, imageName) {
        return `/static/images/plants_images/${plantKey}/${imageName}`;
    }
    // Main listing page (plants.html)
    const plantContainer = document.getElementById('plantContainer');
    const plantLoadingMessage = document.getElementById('plantLoadingMessage');
    const plantsFile = '/static/data/plants.json';
    const imagesFile = '/static/data/image_list.json';
    if (plantLoadingMessage) {
        plantLoadingMessage.style.display = 'block'; // Show loading message initially
    }
    Promise.all([
        fetch(plantsFile).then(resp => resp.json()),
        fetch(imagesFile).then(resp => resp.json())
    ])
        .then(([plantsData, imageList]) => {


            if (plantLoadingMessage) {
                plantLoadingMessage.style.display = 'none'; // Hide loading message on success
            }

            plantContainer.innerHTML = '';

            plantsData.forEach(plant => {
                const plantCard = document.createElement('div');
                plantCard.classList.add('plant-card');

                const plantKey = plant.plant_name.replace(/ /g, '_');

                const cardLink = document.createElement('a');
                cardLink.href = `/plant/${plantKey}`;
                cardLink.style.textDecoration = 'none';
                cardLink.style.color = 'inherit';

                const img = document.createElement('img');
                const images = imageList[plantKey];
                img.src = images && images.length > 0
                    ? getPlantImageUrl(plantKey, images[0])
                    : '/static/images/default.jpg'; // Fallback image
                img.alt = plant.plant_name;

                const h2 = document.createElement('h2');
                h2.textContent = plant.plant_name;

                cardLink.appendChild(img);
                cardLink.appendChild(h2);
                plantCard.appendChild(cardLink);
                plantContainer.appendChild(plantCard);
            });
        })
        .catch(error => {
            console.error('Error loading plants:', error);
            if (plantLoadingMessage) {
                plantLoadingMessage.textContent = 'Failed to load plants. Please try again later.';
                plantLoadingMessage.style.color = 'red';
            } else {
                plantContainer.innerHTML = '<p style="color:red; text-align:center;">Failed to load plants. Please try again later.</p>';
        }
        });




  
  
  
  
  





  
  


    // plants_details.html

    const pathSegments = window.location.pathname.split('/');
    const plantClassName = pathSegments[pathSegments.length - 1]; // e.g., "Amruta_Balli"
    const normalizedName = plantClassName ? plantClassName.replace(/_/g, ' ') : null;

    const plantFullName = document.getElementById("plant-full-name");
    const plantDescriptionText = document.getElementById("plant-description-text");
    const plantUsesList = document.getElementById("plant-uses-list");
    const plantGalleryPreview = document.getElementById("plant-gallery");

    const growthInfoList = document.getElementById("growth-info-list");
    const chemicalConstituents = document.getElementById("chemical-constituents");
    const medicinalProperties = document.getElementById("medicinal-properties");
    const healthBenefits = document.getElementById("health-benefits");
    const partsUsed = document.getElementById("parts-used");
    const preparationMethods = document.getElementById("preparation-methods");
    const dosage = document.getElementById("dosage");
    const sideEffects = document.getElementById("side-effects");
    const treats = document.getElementById("treats");
    const equationsList = document.getElementById("equations-list");

    function renderListOrText(container, items) {
        if (Array.isArray(items) && items.length > 0) {
            container.textContent = items.join(", ");
        } else {
            container.textContent = 'Not available';
        }
    }

    if (plantClassName) {
        fetch('/static/data/plants.json')
            .then(response => response.json())
            .then(plantsData => {
                const plant = plantsData.find(p => p.plant_name === normalizedName);

                if (plant) {
                    plantFullName.textContent = `${plant.plant_name} (${plant.botanical_name})`;
                    plantDescriptionText.textContent = plant.description || 'Not available';
                    renderListOrText(plantUsesList, plant.uses);

                    growthInfoList.innerHTML = '';
                    if (plant.growth_info) {
                        for (const [key, value] of Object.entries(plant.growth_info)) {
                            const li = document.createElement('li');
                            li.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
                            growthInfoList.appendChild(li);
                        }
                    }

                    renderListOrText(chemicalConstituents, plant.chemical_constituents);
                    renderListOrText(medicinalProperties, plant.medicinal_properties);
                    renderListOrText(healthBenefits, plant.health_benefits);
                    renderListOrText(partsUsed, plant.parts_used);
                    renderListOrText(preparationMethods, plant.preparation_methods);
                    dosage.textContent = plant.dosage || 'Not specified';
                    sideEffects.textContent = plant.side_effects || 'None noted';
                    renderListOrText(treats, plant.treats);

                    equationsList.innerHTML = '';
                    (plant.equations || []).forEach(eq => {
                        const li = document.createElement('li');
                        li.textContent = eq;
                        equationsList.appendChild(li);
                    });

                    loadGallery(plantClassName, plant.plant_name);
                } else {
                    document.querySelector('.plant-info').innerHTML = '<p>Plant not found!</p>';
                }
            })
            .catch(error => {
                console.error('Error loading plant details:', error);
                document.querySelector('.plant-info').innerHTML = '<p>Failed to load plant details. Please try again later.</p>';
            });
    } else {
        document.querySelector('.plant-info').innerHTML = '<p>No plant specified in the URL.</p>';
    }




    function loadGallery(plantKey, displayName) {
        fetch('/static/data/image_list.json')
            .then(resp => resp.json())
            .then(imageData => {
                plantGalleryPreview.innerHTML = '';
                const images = imageData[plantKey] || [];

                images.slice(0, 4).forEach((imgName, i) => {
                    const img = document.createElement('img');
                    img.src = getPlantImageUrl(plantKey, imgName);
                    img.alt = `${displayName} image ${i + 1}`;
                    img.classList.add('gallery-image');
                    plantGalleryPreview.appendChild(img);
                });

                if (images.length > 4) {
                    const moreCard = document.createElement('a');
                    moreCard.href = `/gallery/${plantKey}`;
                    moreCard.classList.add('more-card');
                    moreCard.textContent = '+ More';
                    plantGalleryPreview.appendChild(moreCard);
                }
            })
            .catch(() => {
                plantGalleryPreview.innerHTML = '<p>Gallery images not found.</p>';
            });
    }

  
















    // Full gallery page
    // const urlParams = new URLSearchParams(window.location.search);
    // const plantClassName = urlParams.get('plant');
    const galleryTitle = document.getElementById('gallery-title');
    const galleryGrid = document.getElementById('gallery-grid');

    if (!plantClassName) {
        galleryTitle.textContent = 'No plant specified in the URL.';
    } else {
        // Update heading
        galleryTitle.textContent = `Full Gallery: ${plantClassName}`;

        fetch('/static/data/image_list.json')
            .then(resp => resp.json())
            .then(imageData => {
                const images = imageData[plantClassName];
                if (!images || images.length === 0) {
                    galleryGrid.innerHTML = '<p>No images found for this plant.</p>';
                    return;
                }

                images.forEach((imgName, index) => {
                    const img = document.createElement('img');
                    img.src = getPlantImageUrl(plantClassName, imgName);
                    img.alt = `${plantClassName} image ${index + 1}`;
                    img.classList.add('gallery-image');
                    galleryGrid.appendChild(img);
                });
            })
            .catch(() => {
                galleryGrid.innerHTML = '<p>Failed to load gallery images.</p>';
            });
    }

    const backButton = document.querySelector('.back-button');
    if (plantClassName && backButton) {
        backButton.href = `/plant/${encodeURIComponent(plantClassName)}`;
    } else if (backButton) {
        // Optional: If no plant param, disable or hide back button
        backButton.style.display = 'none';
    }




});