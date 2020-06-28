type Module = {
  hot?: {
    accept: () => void;
  };
};

declare const module: Module;

type Process = {
  env: {
    API_BASE_PATH: string;
    USE_FAKE_USER: boolean;
  };
};

declare const process: Process;
