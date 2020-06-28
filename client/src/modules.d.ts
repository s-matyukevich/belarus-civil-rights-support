type Module = {
  hot?: {
    accept: () => void;
  };
};

declare const module: Module;

type Process = {
  env: {
    API_BASE_PATH: string;
  };
};

declare const process: Process
