/**
 * Response helper functions
 */

export const responseSuccess = (
  code = 200,
  message = "Success",
  data = null,
  links = null
) => {
  const response = {
    status: "Success",
    code: code,
    message: message,
    data: data,
  };

  if (links) {
    response.links = links;
  } else {
    response.links = {
      docs: "https://doc.com/api",
    };
  }

  return response;
};

export const responseError = (
  code = 500,
  message = "Internal Server Error",
  stack = null
) => {
  const response = {
    status: "Error",
    code: code,
    message: message,
  };

  // Chỉ hiển thị stack trong development
  if (process.env.NODE_ENV === "development" && stack) {
    response.stack = stack;
  }

  return response;
};

