---
layout: default
---

## Discursos presidenciales del Perú [^1]
El presente repositorio almacena y analiza en nubes de palabras (wordclouds) los discursos presidenciales durante las fiestas patrias del 28 de julio de los gobernantes peruanos del siglo XIX, XX y XXI, de facto y derecho, almacenados en la sección "Mensajes presidenciales y otros documentos para la Historia política del Perú" del sitio web del Congreso de la Républica.

Clasificados los discursos presidenciales once períodos de la Historia del Perú, de la propuesta de Carlos Contreras y Marcos Cueto en su obra Historia del Perú Contemporáneo (2022), se diseñaron nubes de palabras (wordcloud) con el paquete Natural Language Toolkit (NLTK) en Python, buscando de está manera el procesamiento del lenguaje natural del contenido de los referidos discursos para obtener las tendencias recursivas. 

[> Repositorio del proyecto](https://github.com/actio1680/discurso-presidencial-peru)

### CONTENIDO
**1. Descripción de la documentación**

**2. Script Python**

---

### 1. DESCRIPCIÓN DE LA DOCUMENTACIÓN
- **discursos_peru_pdf**: Contiene los discursos en formato PDF utilizados para el diseño de la nube de palabras. Las letras corresponden a la etiqueta creada para la nube de palabras. Así también, en esta carpeta se guardan los resultados en formato PNG.
- **Presidentes_y_períodos_.xlsx**: Contiene un descripción detallada de los gobernantes del siglo XIX y XX, períodos y discursos utilizados para el presente análisis.
- **jupyter_nltk.ipynb**: Es el el código en formato jupyter para la generación de la nube de palabras. 
- **script_nltk.py**: Es el código en formato script utilizado para la generación de la nube de palabras. En este caso, puede utilizarse este o el código de jupyter notebook para el análisis del lenguaje en nube de palabras.

</br>



### 2. SCRIPT PYTHON


|DOCUMENTO||
| --- | --- |
|Script de Python que utiliza el paquete Natural Language Toolkit (NLTK)|![SCRIPT](https://github.com/actio1680/discurso-presidencial-peru/assets/54146735/4e01e5f8-c979-4b59-a777-946beff0f888)|
||[Ver Script](https://github.com/actio1680/discurso-presidencial-peru/blob/main/script_nltk.py)|

<br>
<div align="right">
<i>San Juan de Miraflores, julio de 2023</i><br>
(Última actualización)
</div>

[Subir](#top)
</br>

---
[^1]: Proyecto elaborado con colaboración de [Social-Lab](https://www.facebook.com/profile.php?id=100092960187270)
