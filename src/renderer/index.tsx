// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<div>
    <span>Hello world from React!</span>
    <p>
        We are using Node.js <script>document.write(process.versions.node)</script>,
        Chromium <script>document.write(process.versions.chrome)</script>,
        and Electron <script>document.write(process.versions.electron)</script>.
    </p>
</div>, document.getElementById('app'));
