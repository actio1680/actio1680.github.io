---
title: "Example DataTables with Search and Pagination"
---

## Optimized DataTables

{% search_box %}

<table id="example">
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

<div class="datatable-begin"></div>
<div class="datatable-end"></div>

<script>
$(document).ready(function() {
  $('#example').DataTable({
    "paging": true,
    "lengthMenu": [[20, 50, 100, -1], [20, 50, 100, "Todos"]],
    "pageLength": 20
  });
});
</script>
