<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>UploadSoul Sitemap</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(to bottom right, #f5f3ff, #ffffff);
            color: #333;
          }
          #header {
            background: #7C3AED;
            color: white;
            padding: 2rem;
            text-align: center;
          }
          #header h1 {
            margin: 0;
            font-size: 2.5rem;
          }
          #header p {
            margin: 0.5rem 0 0;
            font-size: 1.2rem;
            opacity: 0.9;
          }
          #content {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 1rem;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border-radius: 0.5rem;
            overflow: hidden;
          }
          th {
            background: #7C3AED;
            color: white;
            padding: 1rem;
            text-align: left;
          }
          td {
            padding: 1rem;
            border-bottom: 1px solid #eee;
          }
          tr:hover {
            background: #f9f9f9;
          }
          a {
            color: #7C3AED;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .priority {
            text-align: center;
          }
          .changefreq {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div id="header">
          <h1>UploadSoul Sitemap</h1>
          <p>Digital Companion Platform - All Available Pages</p>
        </div>
        <div id="content">
          <table>
            <tr>
              <th>URL</th>
              <th>Priority</th>
              <th>Change Frequency</th>
            </tr>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td>
                  <a href="{sitemap:loc}">
                    <xsl:value-of select="sitemap:loc"/>
                  </a>
                </td>
                <td class="priority">
                  <xsl:value-of select="sitemap:priority"/>
                </td>
                <td class="changefreq">
                  <xsl:value-of select="sitemap:changefreq"/>
                </td>
              </tr>
            </xsl:for-each>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet> 