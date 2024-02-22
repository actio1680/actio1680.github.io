---
title: Table test
---
<html>

<head>
  <meta charset="UTF-8">
  <title>Table test</title>
  <link rel="stylesheet" href="https://cdn.datatables.net/1.12.1/css/jquery.dataTables.min.css">
  <link rel="stylesheet" href="styles.css">
</head>

<body> 

<div class="datatable-begin"></div>
<table>
  {% search_box %}
  <thead>
    <tr>
      {% for pair in site.data.authors[0] %}
        <th>{{ pair[0] }}</th>
      {% endfor %}
    </tr>
  </thead>
  <tbody>
    {% paginate %}
      {% for row in page.authors %}
        <tr>
          {% for pair in row %}
            <td>{{ pair[1] }}</td>
          {% endfor %}
        </tr>
      {% endfor %}
    {% endpaginate %}
  </tbody>
</table>
<div class="datatable-end"></div>

</body>

</html> 
