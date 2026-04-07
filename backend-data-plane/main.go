package main

import (
	"log"
	"net"
	"os"
	"os/signal"
	"syscall"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	pb "github.com/hyqxyd/vibe-coding-project/backend-data-plane/api/workspace/v1"
	"github.com/hyqxyd/vibe-coding-project/backend-data-plane/service"
)

func main() {
	port := "50051"
	lis, err := net.Listen("tcp", ":"+port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	grpcServer := grpc.NewServer()

	workspaceSvc, err := service.NewWorkspaceService()
	if err != nil {
		log.Fatalf("failed to initialize workspace service: %v", err)
	}

	pb.RegisterWorkspaceServiceServer(grpcServer, workspaceSvc)

	// Register reflection service on gRPC server for debugging/grpcurl
	reflection.Register(grpcServer)

	go func() {
		log.Printf("Starting gRPC server on port %s...", port)
		if err := grpcServer.Serve(lis); err != nil {
			log.Fatalf("failed to serve: %v", err)
		}
	}()

	// Graceful shutdown
	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	log.Println("Shutting down gRPC server gracefully...")
	grpcServer.GracefulStop()
	log.Println("Server stopped.")
}
