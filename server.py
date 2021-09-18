#!/user/bin/env python3
import socket
import signal
import re

def signal_handler_builder(socket):
    def signal_handler(sig, frame):
        print("\nServer closed")
        socket.close()
        exit()
    return signal_handler

def response_builder(params: dict) -> str:
    header = "\r\nHTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\n\r\n"
    if "order" in params and params["order"] == "desc":
        with open("./static/desc.html") as f:
            return header + f.read()
    else:   
        with open("./static/asc.html") as f:
            return header + f.read()

def get_param(request: str) -> dict:
    params = dict()
    path = request.split("\n")[0].split()[1] # as defined by http protocol
    param = re.search(".*\?(.*)", path)
    # let us ignore escape code as defined here for now https://www.december.com/html/spec/esccodes.html
    if param is not None:
        for value_pair in param.group(1).split("&"):
            key, value = value_pair.split("=")
            params[key] = value
    return params

################# Server Config #######################

HOST = 'localhost'  # loopback interface address 
PORT = 3000         # non-privileged ports are > 1023

################# Server Code #######################

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    s.listen()
    print(f"Server is running on {HOST}:{PORT}")

    # close the socket when ctrl+c is pressed
    signal.signal(signal.SIGINT, signal_handler_builder(s))

    while True:
        conn, addr = s.accept() # connect to the next client in queue
        print(f"Received request from {addr[0]}:{addr[1]}")
        data = conn.recv(1024) # read 1024 bytes
        response = response_builder(get_param(data.decode()))
        conn.sendall(response.encode())
        conn.shutdown(socket.SHUT_WR)
