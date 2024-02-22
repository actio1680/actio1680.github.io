---
title: "Ejemplo DataTables optimizado"
---

## Tabla con paginación y búsqueda

{% search_box %}

<table>
  <thead>
    <tr>
      {% for pair in site.data.authors[0] %}
        <th>{{ pair[0] }}</th>
      {% endfor %}
    </tr>
  </thead>
  <tbody>
    {% paginate %}
      {% for author in page.authors %}
        <tr>
          {% for value in author %}
            <td>{{ value }}</td>
          {% endfor %}
        </tr>
      {% endfor %}
    {% endpaginate %}
  </tbody>
</table>
