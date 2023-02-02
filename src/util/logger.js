
export default function logger(type, message) {
  var colour, text;
  switch (type.toLowerCase()) {
    case 'success':
    case 's':
      colour = 'lightgreen';
      text = 'SUCCESS:'
      break;
    case 'error':
    case 'e':
      colour = 'red';
      text = 'ERROR:'
      break;
    case 'debug':
    case 'd':
      colour = 'yellow';
      text = 'DEBUG:'
      break;
    case 'info':
    case 'i':
      colour = 'lightblue';
      text = 'INFO:'
      break;
  }
  console.log(
    `%c${text} %c${message}`, // Console Message
    `color: ${colour}`,
    `color: white`, // CSS Style
  );
}