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
  {% for row in site.data.authors %}
    {% if forloop.first %}
    <tr>
      {% for pair in row %}
        <th>{{ pair[0] }}</th>
      {% endfor %}
    </tr>
    {% endif %}

    {% tablerow pair in row %}
      {{ pair[1] }}
    {% endtablerow %}
  {% endfor %}
</table>
<div class="datatable-end"></div>
</body>

</html> 
