\copy {{ conn|qtIdent(data.schema, data.table) }} {% if columns %} {{ columns }} {% endif %} {% if data.is_import %}FROM{% else %}TO{% endif %} {{ data.filename|qtLiteral(conn) }} {% if data.oid %} OIDS {% endif %}{% if data.delimiter is defined and data.delimiter == '' and (data.format == 'csv' or data.format == 'text') %} {% elif data.delimiter and data.format != 'binary' and data.delimiter == '[tab]' %} DELIMITER E'\t' {% elif data.format != 'binary' and data.delimiter %} DELIMITER {{ data.delimiter|qtLiteral(conn) }}{% endif %}{% if data.format == 'csv' %} CSV {% endif %} {% if data.format == 'csv' and data.header %} HEADER {% endif %}{% if data.encoding %} ENCODING {{ data.encoding|qtLiteral(conn) }}{% endif %}{% if data.format == 'csv' and data.quote %} QUOTE {{ data.quote|qtLiteral(conn) }}{% endif %}{% if data.format != 'binary' and data.null_string %} NULL {{ data.null_string|qtLiteral(conn) }}{% endif %}{% if data.format == 'csv' and data.escape %} ESCAPE {{ data.escape|qtLiteral(conn) }}{% endif %}{% if data.format == 'csv' and data.is_import and ignore_column_list %} FORCE NOT NULL {{ ignore_column_list }} {% endif %};
