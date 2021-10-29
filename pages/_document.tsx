import Document, { Head, Main, NextScript } from "next/document";
import fs from "fs";
import path from "path";

declare type DocumentFiles = {
  sharedFiles: readonly string[];
  pageFiles: readonly string[];
  allFiles: readonly string[];
};

class EmbeddedCssHead extends Head {
  getCssLinks({ allFiles }: DocumentFiles) {
    const { assetPrefix } = this.context;
    if (!allFiles || allFiles.length === 0) return null;

    return allFiles
      .filter((file: any) => /\.css$/.test(file))
      .map((file: any) => (
        <style
          key={file}
          nonce={this.props.nonce}
          data-href={`${assetPrefix}/_next/${file}`}
          dangerouslySetInnerHTML={{
            __html: fs.readFileSync(
              path.join(process.cwd(), ".next", file),
              "utf-8"
            ),
          }}
        />
      ));
  }
}

export default class CustomDocument extends Document {
  render() {
    return (
      <html>
        <EmbeddedCssHead />
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
