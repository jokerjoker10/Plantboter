import './style.css';
var gitVersion = require('git-tag-version');

interface ContainerProps { }

const Version = () => {
  return (
    <label className="version">V{gitVersion()}</label>
  );
};

export default Version;