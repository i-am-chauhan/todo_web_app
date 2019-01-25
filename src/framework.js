const isMatching = (req, route) => {
  if (route.method && req.method != route.method) return false;
  if (route.method == "POST" && req.url != route.url) return false;
  return true;
};

const send = (res, content, statusCode = 200) => {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

class Handler {
  constructor() {
    this.routes = [];
  }

  use(handler) {
    this.routes.push({ handler });
  }

  get(handler) {
    this.routes.push({ method: "GET", handler });
  }

  post(url, handler) {
    this.routes.push({ method: "POST", url, handler });
  }

  handleRequest(req, res) {
    let matchingRoutes = this.routes.filter(route => isMatching(req, route));
    let remaining = [...matchingRoutes];

    let next = () => {
      let current = remaining[0];
      if (!current) return;
      remaining = remaining.slice(1);
      current.handler(req, res, send, next);
    };
    next();
  }
}
module.exports = { Handler, isMatching, send };
